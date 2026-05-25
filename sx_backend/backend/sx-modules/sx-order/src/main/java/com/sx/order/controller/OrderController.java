package com.sx.order.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.sx.common.result.PageResult;
import com.sx.common.result.R;
import com.sx.framework.annotation.RateLimit;
import com.sx.framework.security.UserContext;
import com.sx.order.dto.CreateOrderDTO;
import com.sx.order.dto.OrderVO;
import com.sx.order.entity.Order;
import com.sx.order.entity.OrderItem;
import com.sx.order.mapper.OrderItemMapper;
import com.sx.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Tag(name = "订单管理")
@RestController
@RequestMapping("/api/v1/order")
public class OrderController {

    private final OrderService orderService;
    private final OrderItemMapper orderItemMapper;

    public OrderController(OrderService orderService, OrderItemMapper orderItemMapper) {
        this.orderService = orderService;
        this.orderItemMapper = orderItemMapper;
    }

    @Operation(summary = "创建订单")
    @PostMapping
    @RateLimit(key = "rate:order:create", window = 60, maxRequests = 10, perUser = true, message = "下单过于频繁，请稍后再试")
    public R<OrderVO> create(@RequestBody CreateOrderDTO dto) {
        Long userId = UserContext.getUserId();
        if (dto.getItems() == null || dto.getItems().isEmpty()) {
            return R.fail(400, "商品不能为空");
        }
        Order order = orderService.createOrder(userId, dto);
        List<OrderItem> items = orderItemMapper.selectList(
                new LambdaQueryWrapper<OrderItem>().eq(OrderItem::getOrderId, order.getId()));
        return R.ok(OrderVO.from(order, items));
    }

    @Operation(summary = "订单列表(含商品)")
    @GetMapping("/list")
    public R<PageResult<OrderVO>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) Integer orderStatus) {
        Long userId = UserContext.getUserId();
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<Order>()
                .eq(Order::getUserId, userId)
                .eq(orderStatus != null, Order::getOrderStatus, orderStatus)
                .orderByDesc(Order::getCreateTime);
        Page<Order> result = orderService.page(new Page<>(page, pageSize), wrapper);

        List<Long> orderIds = result.getRecords().stream().map(Order::getId).collect(Collectors.toList());
        Map<Long, List<OrderItem>> itemMap = orderIds.isEmpty() ? java.util.Collections.emptyMap() :
                orderItemMapper.selectList(new LambdaQueryWrapper<OrderItem>().in(OrderItem::getOrderId, orderIds))
                        .stream().collect(Collectors.groupingBy(OrderItem::getOrderId));

        List<OrderVO> vos = result.getRecords().stream()
                .map(o -> OrderVO.from(o, itemMap.getOrDefault(o.getId(), new ArrayList<>())))
                .collect(Collectors.toList());
        return R.ok(PageResult.of(vos, result.getTotal(), page, pageSize));
    }

    @Operation(summary = "订单详情(含商品)")
    @GetMapping("/{id}")
    public R<OrderVO> detail(@PathVariable Long id) {
        Order order = orderService.getById(id);
        if (order == null) {
            return R.fail(404, "订单不存在");
        }
        List<OrderItem> items = orderItemMapper.selectList(
                new LambdaQueryWrapper<OrderItem>().eq(OrderItem::getOrderId, id));
        return R.ok(OrderVO.from(order, items));
    }

    @Operation(summary = "取消订单")
    @PutMapping("/{id}/cancel")
    @RateLimit(key = "rate:order:cancel", window = 60, maxRequests = 5, perUser = true, message = "操作过于频繁，请稍后再试")
    public R<Void> cancel(@PathVariable Long id) {
        boolean ok = orderService.cancelOrder(id);
        return ok ? R.ok() : R.fail(400, "订单状态不允许取消");
    }

    @Operation(summary = "确认收货")
    @PutMapping("/{id}/confirm")
    public R<Void> confirm(@PathVariable Long id) {
        boolean ok = orderService.confirmReceive(id);
        return ok ? R.ok() : R.fail(400, "订单状态不允许此操作");
    }
}
