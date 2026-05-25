package com.sx.payment.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.sx.payment.entity.OrderRefund;

import java.math.BigDecimal;

public interface RefundService extends IService<OrderRefund> {

    /**
     * 发起退款申请
     */
    OrderRefund applyRefund(Long orderId, BigDecimal amount, String reason);

    /**
     * 处理退款（管理员审核通过后执行）
     */
    boolean processRefund(Long refundId);

    /**
     * 根据订单ID查询退款单
     */
    OrderRefund getByOrderId(Long orderId);
}
