package com.sx.marketing.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.sx.marketing.entity.Coupon;
import com.sx.marketing.entity.UserCoupon;

import java.util.List;

public interface CouponService extends IService<Coupon> {

    /**
     * 获取可领取的优惠券列表
     */
    List<Coupon> listAvailable();

    /**
     * 用户领取优惠券
     */
    boolean receiveCoupon(Long userId, Long couponId);

    /**
     * 查询用户的优惠券
     */
    List<UserCoupon> listUserCoupons(Long userId, Integer status);
}
