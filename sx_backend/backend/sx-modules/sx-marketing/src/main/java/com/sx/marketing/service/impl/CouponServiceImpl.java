package com.sx.marketing.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.sx.common.exception.BusinessException;
import com.sx.common.result.ResultCode;
import com.sx.marketing.entity.Coupon;
import com.sx.marketing.entity.UserCoupon;
import com.sx.marketing.mapper.CouponMapper;
import com.sx.marketing.mapper.UserCouponMapper;
import com.sx.marketing.service.CouponService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CouponServiceImpl extends ServiceImpl<CouponMapper, Coupon> implements CouponService {

    private final UserCouponMapper userCouponMapper;

    public CouponServiceImpl(UserCouponMapper userCouponMapper) {
        this.userCouponMapper = userCouponMapper;
    }

    @Override
    public List<Coupon> listAvailable() {
        LocalDateTime now = LocalDateTime.now();
        List<Coupon> all = list(new LambdaQueryWrapper<Coupon>()
                .eq(Coupon::getStatus, 1)
                .ge(Coupon::getEndTime, now)
                .le(Coupon::getStartTime, now));
        return all.stream()
                .filter(c -> c.getReceivedCount() < c.getTotalCount())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public boolean receiveCoupon(Long userId, Long couponId) {
        Coupon coupon = getById(couponId);
        if (coupon == null || coupon.getStatus() != 1) {
            throw new BusinessException(ResultCode.COUPON_EXPIRED);
        }
        if (coupon.getReceivedCount() >= coupon.getTotalCount()) {
            throw new BusinessException(ResultCode.COUPON_RECEIVED);
        }

        Long count = userCouponMapper.selectCount(
                new LambdaQueryWrapper<UserCoupon>()
                        .eq(UserCoupon::getUserId, userId)
                        .eq(UserCoupon::getCouponId, couponId));
        if (count >= coupon.getPerUserLimit()) {
            throw new BusinessException(ResultCode.COUPON_RECEIVED);
        }

        UserCoupon uc = new UserCoupon();
        uc.setUserId(userId);
        uc.setCouponId(couponId);
        uc.setStatus(1);
        userCouponMapper.insert(uc);

        coupon.setReceivedCount(coupon.getReceivedCount() + 1);
        updateById(coupon);

        return true;
    }

    @Override
    public List<UserCoupon> listUserCoupons(Long userId, Integer status) {
        LambdaQueryWrapper<UserCoupon> wrapper = new LambdaQueryWrapper<UserCoupon>()
                .eq(UserCoupon::getUserId, userId)
                .orderByDesc(UserCoupon::getCreateTime);
        if (status != null) {
            wrapper.eq(UserCoupon::getStatus, status);
        }
        return userCouponMapper.selectList(wrapper);
    }
}
