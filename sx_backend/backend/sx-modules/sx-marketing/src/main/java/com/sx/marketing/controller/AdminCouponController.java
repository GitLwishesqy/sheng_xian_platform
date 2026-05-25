package com.sx.marketing.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.sx.common.result.R;
import com.sx.marketing.entity.Coupon;
import com.sx.marketing.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "管理端-优惠券")
@RestController
@RequestMapping("/admin/v1/coupon")
public class AdminCouponController {

    private final CouponService couponService;

    public AdminCouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @Operation(summary = "优惠券列表")
    @GetMapping("/list")
    public R<List<Coupon>> list() {
        return R.ok(couponService.list(
                new LambdaQueryWrapper<Coupon>().orderByDesc(Coupon::getCreateTime)));
    }

    @Operation(summary = "创建优惠券")
    @PostMapping
    public R<Void> add(@RequestBody Coupon coupon) {
        if (coupon.getStatus() == null) coupon.setStatus(1);
        if (coupon.getReceivedCount() == null) coupon.setReceivedCount(0);
        couponService.save(coupon);
        return R.ok();
    }

    @Operation(summary = "编辑优惠券")
    @PutMapping("/{id}")
    public R<Void> update(@PathVariable Long id, @RequestBody Coupon coupon) {
        coupon.setId(id);
        couponService.updateById(coupon);
        return R.ok();
    }

    @Operation(summary = "启用/停用")
    @PutMapping("/{id}/status")
    public R<Void> toggleStatus(@PathVariable Long id, @RequestParam Integer status) {
        Coupon coupon = new Coupon();
        coupon.setId(id);
        coupon.setStatus(status);
        couponService.updateById(coupon);
        return R.ok();
    }
}
