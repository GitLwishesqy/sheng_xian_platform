package com.sx.payment.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.sx.payment.entity.Payment;
import com.sx.payment.mapper.PaymentMapper;
import com.sx.payment.service.PaymentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class PaymentServiceImpl extends ServiceImpl<PaymentMapper, Payment> implements PaymentService {

    @Override
    @Transactional
    public Payment createPayment(Long orderId, BigDecimal amount, Integer method) {
        String paymentNo = "PAY" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
                + String.format("%06d", (int) (Math.random() * 1000000));

        Payment payment = new Payment();
        payment.setOrderId(orderId);
        payment.setPaymentNo(paymentNo);
        payment.setAmount(amount);
        payment.setMethod(method != null ? method : 1);
        payment.setStatus(0);
        save(payment);

        return payment;
    }

    @Override
    public Payment getByOrderId(Long orderId) {
        return getOne(new LambdaQueryWrapper<Payment>().eq(Payment::getOrderId, orderId));
    }

    @Override
    @Transactional
    public boolean handlePaymentNotify(String paymentNo, String transactionId) {
        Payment payment = getByPaymentNo(paymentNo);
        if (payment == null || payment.getStatus() != 0) {
            return false;
        }

        payment.setStatus(1);
        payment.setTransactionId(transactionId);
        payment.setPayTime(LocalDateTime.now());
        updateById(payment);

        return true;
    }

    @Override
    public Payment getByPaymentNo(String paymentNo) {
        return getOne(new LambdaQueryWrapper<Payment>().eq(Payment::getPaymentNo, paymentNo));
    }
}
