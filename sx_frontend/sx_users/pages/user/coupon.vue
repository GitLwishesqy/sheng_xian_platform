<template>
<view class="page">
    <!-- 可领取的优惠券 -->
    <view class="section" v-if="!selectMode">
        <view class="section-title">
            <image src="/static/images/icon-coupon.png" class="title-icon" mode="aspectFit"></image>
            可领取的优惠券
        </view>
        <view class="coupon-item" v-for="cp in availableCoupons" :key="cp.id">
            <view class="coupon-left">
                <text class="coupon-value" v-if="cp.type === 1">¥{{ cp.discountValue }}</text>
                <text class="coupon-value" v-else-if="cp.type === 2">{{ cp.discountValue }}折</text>
                <text class="coupon-value" v-else>¥{{ cp.discountValue }}</text>
                <text class="coupon-condition" v-if="cp.minAmount > 0">满{{ cp.minAmount }}元可用</text>
                <text class="coupon-condition" v-else>无门槛</text>
            </view>
            <view class="coupon-right">
                <text class="coupon-name">{{ cp.name }}</text>
                <text class="coupon-time">有效期至 {{ cp.endTime }}</text>
                <button class="receive-btn" @click="receiveCoupon(cp.id)">领取</button>
            </view>
        </view>
        <text class="empty-tip" v-if="availableCoupons.length === 0">暂无可用优惠券</text>
    </view>

    <!-- 我的优惠券 -->
    <view class="section">
        <view class="section-title">{{ selectMode ? '选择优惠券' : '我的优惠券' }}</view>
        <view class="coupon-item" v-for="cp in myCoupons" :key="cp.id"
              :class="{ disabled: cp.status !== 1 }"
              @click="selectCoupon(cp)">
            <view class="coupon-left">
                <text class="coupon-value">¥{{ cp.discountValue }}</text>
                <text class="coupon-status" v-if="cp.status === 2">已使用</text>
                <text class="coupon-status" v-else-if="cp.status === 3">已过期</text>
            </view>
            <view class="coupon-right">
                <text class="coupon-name">{{ cp.name }}</text>
                <text class="coupon-time">{{ cp.endTime }} 前可用</text>
            </view>
        </view>
        <text class="empty-tip" v-if="myCoupons.length === 0">暂无优惠券</text>
    </view>
</view>
</template>

<script>
import couponApi from '@/api/coupon.js'

export default {
    data() {
        return {
            availableCoupons: [],
            myCoupons: [],
            selectMode: false
        }
    },
    onLoad(options) {
        if (options.mode === 'select') this.selectMode = true
        this.loadData()
    },
    methods: {
        async loadData() {
            const [availRes, myRes] = await Promise.all([
                couponApi.getAvailableCoupons(),
                couponApi.getMyCoupons()
            ])
            if (availRes.code === 200) this.availableCoupons = availRes.data || []
            if (myRes.code === 200) this.myCoupons = myRes.data || []
        },
        async receiveCoupon(id) {
            const res = await couponApi.receiveCoupon(id)
            if (res.code === 200) {
                uni.showToast({ title: '领取成功', icon: 'success' })
                this.loadData()
            }
        },
        selectCoupon(cp) {
            if (!this.selectMode || cp.status !== 1) return
            const pages = getCurrentPages()
            const prevPage = pages[pages.length - 2]
            if (prevPage) {
                prevPage.$vm.selectedCoupon = cp
            }
            uni.navigateBack()
        }
    }
}
</script>

<style lang="scss" scoped>
.page { background: #f5f5f5; min-height: 100vh; padding: 20rpx; }
.section { margin-bottom: 30rpx; }
.section-title { display: flex; align-items: center; font-size: 30rpx; font-weight: bold; margin-bottom: 16rpx; }
.title-icon { width: 36rpx; height: 36rpx; margin-right: 8rpx; }
.coupon-item { display: flex; background: #fff; border-radius: 16rpx; overflow: hidden; margin-bottom: 16rpx; }
.coupon-item.disabled { opacity: 0.5; }
.coupon-left { width: 200rpx; background: #07c160; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24rpx 0; }
.coupon-value { font-size: 40rpx; font-weight: bold; }
.coupon-condition { font-size: 20rpx; margin-top: 6rpx; opacity: 0.8; }
.coupon-status { font-size: 22rpx; margin-top: 8rpx; padding: 4rpx 12rpx; background: rgba(255,255,255,0.3); border-radius: 4rpx; }
.coupon-right { flex: 1; padding: 20rpx; display: flex; flex-direction: column; justify-content: center; }
.coupon-name { font-size: 28rpx; font-weight: bold; }
.coupon-time { font-size: 22rpx; color: #999; margin-top: 8rpx; }
.receive-btn { background: #07c160; color: #fff; border: none; border-radius: 20rpx; padding: 8rpx 20rpx; font-size: 22rpx; margin-top: 12rpx; align-self: flex-start; }
.empty-tip { text-align: center; color: #999; padding: 40rpx 0; font-size: 26rpx; }
</style>
