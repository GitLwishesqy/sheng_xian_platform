package com.sx.payment.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.sx.payment.entity.OrderRefund;
import com.sx.payment.mapper.OrderRefundMapper;
import com.sx.payment.service.RefundService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class RefundServiceImpl extends ServiceImpl<OrderRefundMapper, OrderRefund> implements RefundService {

    @Override
    @Transactional
    public OrderRefund applyRefund(Long orderId, BigDecimal amount, String reason) {
        String refundNo = "RF" + LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
                + String.format("%06d", (int) (Math.random() * 1000000));

        OrderRefund refund = new OrderRefund();
        refund.setOrderId(orderId);
        refund.setRefundNo(refundNo);
        refund.setAmount(amount);
        refund.setReason(reason);
        refund.setStatus(1);
        save(refund);

        return refund;
    }

    @Override
    @Transactional
    public boolean processRefund(Long refundId) {
        OrderRefund refund = getById(refundId);
        if (refund == null || refund.getStatus() != 1) {
            return false;
        }

        refund.setStatus(4);
        refund.setHandleTime(LocalDateTime.now());
        refund.setHandleRemark("管理员审核通过，退款成功");
        updateById(refund);

        return true;
    }

    @Override
    public OrderRefund getByOrderId(Long orderId) {
        return getOne(new LambdaQueryWrapper<OrderRefund>().eq(OrderRefund::getOrderId, orderId));
    }
}
