package com.sx.payment.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.sx.payment.entity.Payment;

import java.math.BigDecimal;

public interface PaymentService extends IService<Payment> {

    /**
     * 创建支付单
     */
    Payment createPayment(Long orderId, BigDecimal amount, Integer method);

    /**
     * 处理支付回调（仅更新支付单状态）
     */
    boolean handlePaymentNotify(String paymentNo, String transactionId);

    /**
     * 根据支付单号查询
     */
    Payment getByPaymentNo(String paymentNo);

    /**
     * 根据订单ID查询支付单
     */
    Payment getByOrderId(Long orderId);
}
