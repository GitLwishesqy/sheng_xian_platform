package com.sx.payment.controller;

import com.sx.common.result.R;
import com.sx.framework.annotation.RateLimit;
import com.sx.order.entity.Order;
import com.sx.order.service.OrderService;
import com.sx.payment.entity.Payment;
import com.sx.payment.service.PaymentService;
import com.sx.payment.service.RefundService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "支付管理")
@RestController
@RequestMapping("/api/v1/payment")
public class PaymentController {

    private final PaymentService paymentService;
    private final RefundService refundService;
    private final OrderService orderService;

    public PaymentController(PaymentService paymentService, RefundService refundService,
                             OrderService orderService) {
        this.paymentService = paymentService;
        this.refundService = refundService;
        this.orderService = orderService;
    }

    @Operation(summary = "发起支付")
    @PostMapping("/pay/{orderId}")
    @RateLimit(key = "rate:payment:pay", window = 60, maxRequests = 5, perUser = true, message = "支付请求过于频繁，请稍后再试")
    public R<Payment> pay(@PathVariable Long orderId, @RequestParam(defaultValue = "1") Integer method) {
        Order order = orderService.getById(orderId);
        if (order == null) return R.fail(404, "订单不存在");
        if (order.getOrderStatus() != 1) return R.fail(400, "订单状态不允许支付");
        Payment payment = paymentService.createPayment(orderId, order.getPayAmount(), method);
        return R.ok(payment);
    }

    @Operation(summary = "支付回调通知（由支付渠道调用）")
    @PostMapping("/notify/{paymentNo}")
    public R<String> notify(@PathVariable String paymentNo, @RequestBody Map<String, String> params) {
        String transactionId = params.getOrDefault("transactionId", "");
        boolean paymentUpdated = paymentService.handlePaymentNotify(paymentNo, transactionId);
        if (!paymentUpdated) {
            return R.fail(400, "支付回调处理失败");
        }

        Payment payment = paymentService.getByPaymentNo(paymentNo);
        orderService.handlePaymentSuccess(payment.getOrderId(), payment.getMethod(), transactionId);

        return R.ok("success");
    }

    @Operation(summary = "查询支付状态")
    @GetMapping("/{orderId}")
    public R<Payment> query(@PathVariable Long orderId) {
        Payment payment = paymentService.getByOrderId(orderId);
        return R.ok(payment);
    }
}


