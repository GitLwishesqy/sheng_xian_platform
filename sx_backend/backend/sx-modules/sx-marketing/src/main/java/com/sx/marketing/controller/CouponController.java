package com.sx.marketing.controller;

import com.sx.common.result.R;
import com.sx.framework.annotation.RateLimit;
import com.sx.framework.security.UserContext;
import com.sx.marketing.entity.Coupon;
import com.sx.marketing.entity.UserCoupon;
import com.sx.marketing.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "优惠券")
@RestController
@RequestMapping("/api/v1/coupon")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @Operation(summary = "可领取优惠券")
    @GetMapping("/available")
    public R<List<Coupon>> available() {
        return R.ok(couponService.listAvailable());
    }

    @Operation(summary = "领取优惠券")
    @PostMapping("/{id}/receive")
    @RateLimit(key = "rate:coupon:receive", window = 60, maxRequests = 5, perUser = true, message = "领取过于频繁，请稍后再试")
    public R<Void> receive(@PathVariable Long id) {
        Long userId = UserContext.getUserId();
        boolean ok = couponService.receiveCoupon(userId, id);
        return ok ? R.ok() : R.fail(400, "领取失败");
    }

    @Operation(summary = "我的优惠券")
    @GetMapping("/my")
    public R<List<UserCoupon>> myCoupons(@RequestParam(required = false) Integer status) {
        Long userId = UserContext.getUserId();
        return R.ok(couponService.listUserCoupons(userId, status));
    }

    @Operation(summary = "订单可用优惠券")
    @GetMapping("/order-available")
    public R<List<UserCoupon>> orderAvailable() {
        Long userId = UserContext.getUserId();
        return R.ok(couponService.listUserCoupons(userId, 1));
    }
}
