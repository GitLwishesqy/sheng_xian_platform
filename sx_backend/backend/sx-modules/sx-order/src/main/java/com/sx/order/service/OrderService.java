package com.sx.order.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.sx.order.dto.CreateOrderDTO;
import com.sx.order.entity.Order;

public interface OrderService extends IService<Order> {
    Order getByOrderNo(String orderNo);
    boolean cancelOrder(Long orderId);
    Order createOrder(Long userId, CreateOrderDTO dto);

    /**
     * 管理员发货
     */
    boolean deliveryOrder(Long orderId);

    /**
     * 用户确认收货
     */
    boolean confirmReceive(Long orderId);

    /**
     * 支付回调：更新订单状态为待发货（乐观锁）
     */
    boolean handlePaymentSuccess(Long orderId, Integer paymentMethod, String transactionId);

    /**
     * 超时关单：取消过期未支付订单（批量）
     * @return 取消的订单数量
     */
    int cancelTimeoutOrders();
}
