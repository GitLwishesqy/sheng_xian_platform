package com.sx.order.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.sx.common.enums.OrderStatusEnum;
import com.sx.common.exception.BusinessException;
import com.sx.common.result.ResultCode;
import com.sx.order.dto.CreateOrderDTO;
import com.sx.order.entity.Order;
import com.sx.order.entity.OrderItem;
import com.sx.order.entity.OrderStatusLog;
import com.sx.order.mapper.OrderItemMapper;
import com.sx.order.mapper.OrderMapper;
import com.sx.order.mapper.OrderStatusLogMapper;
import com.sx.order.service.OrderService;
import com.sx.product.entity.Product;
import com.sx.product.entity.ProductSku;
import com.sx.product.mapper.ProductMapper;
import com.sx.product.mapper.ProductSkuMapper;
import com.sx.user.entity.UserAddress;
import com.sx.user.mapper.UserAddressMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl extends ServiceImpl<OrderMapper, Order> implements OrderService {

    private final OrderItemMapper orderItemMapper;
    private final OrderStatusLogMapper orderStatusLogMapper;
    private final ProductMapper productMapper;
    private final ProductSkuMapper skuMapper;
    private final UserAddressMapper userAddressMapper;

    public OrderServiceImpl(OrderItemMapper orderItemMapper,
                            OrderStatusLogMapper orderStatusLogMapper,
                            ProductMapper productMapper,
                            ProductSkuMapper skuMapper,
                            UserAddressMapper userAddressMapper) {
        this.orderItemMapper = orderItemMapper;
        this.orderStatusLogMapper = orderStatusLogMapper;
        this.productMapper = productMapper;
        this.skuMapper = skuMapper;
        this.userAddressMapper = userAddressMapper;
    }

    @Override
    public Order getByOrderNo(String orderNo) {
        return getOne(new LambdaQueryWrapper<Order>().eq(Order::getOrderNo, orderNo));
    }

    @Override
    @Transactional
    public Order createOrder(Long userId, CreateOrderDTO dto) {
        // === 1. 配送方式校验 ===
        int deliveryType = dto.getDeliveryType() != null ? dto.getDeliveryType() : 1;
        if (deliveryType == 1 && dto.getAddressId() == null) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "配送到家必须选择收货地址");
        }
        if (deliveryType == 2 && dto.getPickupPointId() == null) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "到店自提必须选择自提点");
        }

        // === 2. 收集所有 productId 和 skuId，批量查询（消除 N+1 问题） ===
        List<Long> productIds = dto.getItems().stream()
                .map(CreateOrderDTO.OrderItemDTO::getProductId)
                .distinct().collect(Collectors.toList());
        List<Long> skuIds = dto.getItems().stream()
                .map(CreateOrderDTO.OrderItemDTO::getSkuId)
                .filter(Objects::nonNull)
                .distinct().collect(Collectors.toList());

        Map<Long, Product> productMap = productIds.isEmpty() ? Collections.emptyMap() :
                productMapper.selectBatchIds(productIds).stream()
                        .collect(Collectors.toMap(Product::getId, p -> p));
        Map<Long, ProductSku> skuMap = skuIds.isEmpty() ? Collections.emptyMap() :
                skuMapper.selectBatchIds(skuIds).stream()
                        .collect(Collectors.toMap(ProductSku::getId, s -> s));

        // === 3. 库存校验 + 金额计算（一次遍历，使用缓存的 Map） ===
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CreateOrderDTO.OrderItemDTO item : dto.getItems()) {
            Product p = productMap.get(item.getProductId());
            if (p == null) {
                throw new BusinessException(ResultCode.PRODUCT_NOT_EXIST);
            }
            ProductSku sku = null;
            if (item.getSkuId() != null) {
                sku = skuMap.get(item.getSkuId());
                if (sku == null) {
                    throw new BusinessException(ResultCode.PRODUCT_NOT_EXIST);
                }
            }

            // 库存校验
            int checkStock = sku != null ? sku.getStock() : p.getStock();
            if (checkStock < item.getQuantity()) {
                throw new BusinessException(ResultCode.STOCK_INSUFFICIENT);
            }

            // 累加金额
            BigDecimal price = sku != null ? sku.getPrice() : p.getPrice();
            totalAmount = totalAmount.add(price.multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        // === 4. 生成订单号 ===
        String orderNo = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
                + String.format("%06d", (int) (Math.random() * 1000000));

        // === 5. 地址快照 ===
        String addressSnapshot = null;
        if (dto.getAddressId() != null) {
            UserAddress addr = userAddressMapper.selectById(dto.getAddressId());
            if (addr != null) {
                addressSnapshot = addr.getProvince() + addr.getCity() + addr.getDistrict()
                        + " " + addr.getDetailAddress()
                        + " (" + addr.getReceiverName() + " " + addr.getReceiverPhone() + ")";
            }
        }

        // === 6. 动态配送费（配送到家=5元，到店自提=0元） ===
        BigDecimal deliveryFee = deliveryType == 1 ? BigDecimal.valueOf(5) : BigDecimal.ZERO;
        BigDecimal discountAmount = BigDecimal.ZERO; // 后续优惠券功能使用

        // === 7. 保存订单 ===
        Order order = new Order();
        order.setOrderNo(orderNo);
        order.setUserId(userId);
        order.setDeliveryType(deliveryType);
        order.setAddressId(dto.getAddressId());
        order.setPickupPointId(dto.getPickupPointId());
        order.setAddressSnapshot(addressSnapshot);
        order.setTotalAmount(totalAmount);
        order.setDeliveryFee(deliveryFee);
        order.setDiscountAmount(discountAmount);
        order.setPayAmount(totalAmount.add(deliveryFee).subtract(discountAmount));
        order.setOrderStatus(OrderStatusEnum.PENDING_PAY.getCode());
        order.setPaymentStatus(0);
        order.setRemark(dto.getRemark());
        save(order);

        // 记录状态日志
        saveStatusLog(order.getId(), null, OrderStatusEnum.PENDING_PAY.getCode(), "用户", "提交订单");

        // === 8. 保存订单明细并扣减库存（复用缓存的 Map） ===
        for (CreateOrderDTO.OrderItemDTO item : dto.getItems()) {
            Product p = productMap.get(item.getProductId());
            ProductSku sku = item.getSkuId() != null ? skuMap.get(item.getSkuId()) : null;

            OrderItem oi = new OrderItem();
            oi.setOrderId(order.getId());
            oi.setProductId(item.getProductId());
            oi.setSkuId(item.getSkuId());
            oi.setProductName(p.getName());
            oi.setProductImage(p.getCoverImage());
            oi.setQuantity(item.getQuantity());

            if (sku != null) {
                oi.setPrice(sku.getPrice());
                oi.setSpecInfo((sku.getSpecName() != null ? sku.getSpecName() : "") + " " +
                               (sku.getSpecValue() != null ? sku.getSpecValue() : ""));
                // 原子扣减SKU库存
                int rows = skuMapper.deductStock(item.getSkuId(), -item.getQuantity());
                if (rows == 0) {
                    throw new BusinessException(ResultCode.STOCK_INSUFFICIENT);
                }
            } else {
                oi.setPrice(p.getPrice());
            }

            oi.setTotalAmount(oi.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            orderItemMapper.insert(oi);

            // 原子扣减商品库存并增加销量
            int rows = productMapper.updateStockAtomic(p.getId(), -item.getQuantity(), item.getQuantity());
            if (rows == 0) {
                throw new BusinessException(ResultCode.STOCK_INSUFFICIENT);
            }
        }

        return order;
    }

    @Override
    @Transactional
    public boolean cancelOrder(Long orderId) {
        // 乐观锁：仅当 order_status = PENDING_PAY 时才允许取消
        int rows = baseMapper.cancelOrderAtomic(orderId,
                OrderStatusEnum.PENDING_PAY.getCode(),
                OrderStatusEnum.CANCELLED.getCode(),
                LocalDateTime.now());

        if (rows == 0) {
            return false; // 状态已被其他操作变更（如支付回调）
        }

        // 恢复库存
        restoreOrderStock(orderId);

        // 记录状态日志
        saveStatusLog(orderId, OrderStatusEnum.PENDING_PAY.getCode(),
                OrderStatusEnum.CANCELLED.getCode(), "用户", "取消订单");

        return true;
    }

    @Override
    @Transactional
    public boolean deliveryOrder(Long orderId) {
        int rows = baseMapper.updateStatusAtomic(orderId,
                OrderStatusEnum.PENDING_DELIVERY.getCode(),
                OrderStatusEnum.SHIPPED.getCode());

        if (rows == 0) {
            return false;
        }

        // 补充发货时间
        Order order = getById(orderId);
        order.setDeliveryTime(LocalDateTime.now());
        updateById(order);

        saveStatusLog(orderId, OrderStatusEnum.PENDING_DELIVERY.getCode(),
                OrderStatusEnum.SHIPPED.getCode(), "管理员", "发货");

        return true;
    }

    @Override
    @Transactional
    public boolean confirmReceive(Long orderId) {
        int rows = baseMapper.updateStatusAtomic(orderId,
                OrderStatusEnum.SHIPPED.getCode(),
                OrderStatusEnum.RECEIVED.getCode());

        if (rows == 0) {
            return false;
        }

        // 补充收货时间
        Order order = getById(orderId);
        order.setReceiveTime(LocalDateTime.now());
        updateById(order);

        saveStatusLog(orderId, OrderStatusEnum.SHIPPED.getCode(),
                OrderStatusEnum.RECEIVED.getCode(), "用户", "确认收货");

        return true;
    }

    @Override
    @Transactional
    public boolean handlePaymentSuccess(Long orderId, Integer paymentMethod, String transactionId) {
        // 乐观锁：仅当 order_status = PENDING_PAY 时才允许更新为待发货
        int rows = baseMapper.updateOrderStatusAtomic(orderId,
                OrderStatusEnum.PENDING_PAY.getCode(),
                OrderStatusEnum.PENDING_DELIVERY.getCode(),
                1, paymentMethod, LocalDateTime.now());

        if (rows == 0) {
            return false; // 状态已被其他操作变更（如超时关单）
        }

        saveStatusLog(orderId, OrderStatusEnum.PENDING_PAY.getCode(),
                OrderStatusEnum.PENDING_DELIVERY.getCode(),
                "系统", "支付成功，交易号: " + transactionId);

        return true;
    }

    @Override
    @Transactional
    public int cancelTimeoutOrders() {
        LocalDateTime expireTime = LocalDateTime.now().minusMinutes(30);

        // 查询超时订单
        java.util.List<Order> timeoutOrders = list(
                new LambdaQueryWrapper<Order>()
                        .eq(Order::getOrderStatus, OrderStatusEnum.PENDING_PAY.getCode())
                        .lt(Order::getCreateTime, expireTime)
        );

        if (timeoutOrders.isEmpty()) {
            return 0;
        }

        int cancelled = 0;
        for (Order order : timeoutOrders) {
            // 逐单CAS取消，避免支付回调并发冲突
            int rows = baseMapper.cancelOrderAtomic(order.getId(),
                    OrderStatusEnum.PENDING_PAY.getCode(),
                    OrderStatusEnum.CANCELLED.getCode(),
                    LocalDateTime.now());

            if (rows > 0) {
                restoreOrderStock(order.getId());
                saveStatusLog(order.getId(), OrderStatusEnum.PENDING_PAY.getCode(),
                        OrderStatusEnum.CANCELLED.getCode(), "系统", "超时未支付，自动取消");
                cancelled++;
            }
        }

        return cancelled;
    }

    private void restoreOrderStock(Long orderId) {
        orderItemMapper.selectList(
                new LambdaQueryWrapper<OrderItem>().eq(OrderItem::getOrderId, orderId)
        ).forEach(item -> {
            productMapper.deductStock(item.getProductId(), item.getQuantity());
            if (item.getSkuId() != null) {
                skuMapper.deductStock(item.getSkuId(), item.getQuantity());
            }
        });
    }

    private void saveStatusLog(Long orderId, Integer fromStatus, Integer toStatus,
                               String operator, String remark) {
        OrderStatusLog log = new OrderStatusLog();
        log.setOrderId(orderId);
        log.setFromStatus(fromStatus);
        log.setToStatus(toStatus);
        log.setOperator(operator);
        log.setRemark(remark);
        orderStatusLogMapper.insert(log);
    }
}
