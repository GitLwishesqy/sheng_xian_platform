package com.sx.payment.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.sx.common.result.PageResult;
import com.sx.common.result.R;
import com.sx.order.entity.Order;
import com.sx.order.entity.OrderStatusLog;
import com.sx.order.mapper.OrderMapper;
import com.sx.order.mapper.OrderStatusLogMapper;
import com.sx.common.enums.OrderStatusEnum;
import com.sx.payment.entity.OrderRefund;
import com.sx.payment.service.RefundService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Tag(name = "管理端-退款")
@RestController
@RequestMapping("/admin/v1/order/refund")
public class AdminRefundController {

    private final RefundService refundService;
    private final OrderMapper orderMapper;
    private final OrderStatusLogMapper orderStatusLogMapper;

    public AdminRefundController(RefundService refundService, OrderMapper orderMapper,
                                  OrderStatusLogMapper orderStatusLogMapper) {
        this.refundService = refundService;
        this.orderMapper = orderMapper;
        this.orderStatusLogMapper = orderStatusLogMapper;
    }

    @Operation(summary = "退款列表")
    @GetMapping("/list")
    public R<PageResult<OrderRefund>> list(@RequestParam(defaultValue = "1") int page,
                                            @RequestParam(defaultValue = "20") int pageSize) {
        Page<OrderRefund> result = refundService.page(new Page<>(page, pageSize));
        return R.ok(PageResult.of(result));
    }

    @Operation(summary = "处理退款")
    @PutMapping("/{id}/handle")
    public R<Void> handleRefund(@PathVariable Long id, @RequestParam Integer agree) {
        OrderRefund refund = refundService.getById(id);
        if (refund == null) return R.fail(404, "退款单不存在");

        if (agree == 1) {
            refundService.processRefund(id);
            // 同步更新订单状态
            Order order = orderMapper.selectById(refund.getOrderId());
            if (order != null) {
                Integer fromStatus = order.getOrderStatus();
                order.setOrderStatus(OrderStatusEnum.REFUNDED.getCode());
                order.setPaymentStatus(2);
                orderMapper.updateById(order);

                OrderStatusLog log = new OrderStatusLog();
                log.setOrderId(order.getId());
                log.setFromStatus(fromStatus);
                log.setToStatus(OrderStatusEnum.REFUNDED.getCode());
                log.setOperator("管理员");
                log.setRemark("退款处理完成，退款单号: " + refund.getRefundNo());
                orderStatusLogMapper.insert(log);
            }
        } else {
            refund.setStatus(3);
            refund.setHandleTime(LocalDateTime.now());
            refund.setHandleRemark("管理员审核拒绝");
            refundService.updateById(refund);
        }
        return R.ok();
    }
}
