package com.sx.order.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.sx.common.result.PageResult;
import com.sx.common.result.R;
import com.sx.order.entity.Order;
import com.sx.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@Tag(name = "管理端-订单")
@RestController
@RequestMapping("/admin/v1/order")
public class AdminOrderController {

    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @Operation(summary = "订单列表")
    @GetMapping("/list")
    public R<PageResult<Order>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) Integer orderStatus,
            @RequestParam(required = false) String orderNo) {
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<Order>()
                .eq(orderStatus != null, Order::getOrderStatus, orderStatus)
                .eq(orderNo != null && !orderNo.isEmpty(), Order::getOrderNo, orderNo)
                .orderByDesc(Order::getCreateTime);
        Page<Order> result = orderService.page(new Page<>(page, pageSize), wrapper);
        return R.ok(PageResult.of(result));
    }

    @Operation(summary = "发货")
    @PutMapping("/{id}/delivery")
    public R<Void> delivery(@PathVariable Long id) {
        boolean ok = orderService.deliveryOrder(id);
        return ok ? R.ok() : R.fail(400, "订单状态不允许此操作");
    }

    @Operation(summary = "取消订单")
    @PutMapping("/{id}/cancel")
    public R<Void> cancel(@PathVariable Long id) {
        orderService.cancelOrder(id);
        return R.ok();
    }
}
