<template>
<view class="page">
    <!-- 头部 -->
    <view class="header">
        <view class="user-info" @click="goLogin" v-if="!isLogin">
            <image src="/static/images/default-avatar.png" class="avatar"></image>
            <text class="nickname">点击登录</text>
            <text class="arrow">→</text>
        </view>
        <view class="user-info" v-else>
            <image :src="userInfo.avatar || '/static/images/default-avatar.png'" class="avatar"></image>
            <view class="user-text">
                <text class="nickname">{{ userInfo.nickname || '用户' }}</text>
                <text class="phone" v-if="userInfo.phone">{{ userInfo.phone }}</text>
            </view>
        </view>
    </view>

    <!-- 订单入口 -->
    <view class="order-entry card">
        <view class="entry-header flex-between">
            <text class="entry-title">我的订单</text>
            <text class="entry-more" @click="goOrderList('')">全部订单 →</text>
        </view>
        <view class="entry-icons">
            <view class="entry-item" @click="goOrderList(1)">
                <image :src="ICON.pendingPay" class="entry-icon-img" mode="aspectFit"></image>
                <text class="entry-label">待付款</text>
            </view>
            <view class="entry-item" @click="goOrderList(2)">
                <image :src="ICON.pendingDelivery" class="entry-icon-img" mode="aspectFit"></image>
                <text class="entry-label">待发货</text>
            </view>
            <view class="entry-item" @click="goOrderList(3)">
                <image :src="ICON.shipped" class="entry-icon-img" mode="aspectFit"></image>
                <text class="entry-label">待收货</text>
            </view>
            <view class="entry-item" @click="goOrderList(5)">
                <image :src="ICON.completed" class="entry-icon-img" mode="aspectFit"></image>
                <text class="entry-label">已完成</text>
            </view>
        </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu card">
        <view class="menu-item" @click="goAddressList">
            <image :src="ICON.address" class="menu-icon" mode="aspectFit"></image>
            <text>收货地址</text>
            <text class="menu-arrow">→</text>
        </view>
        <view class="menu-item" @click="goCouponList">
            <image :src="ICON.coupon" class="menu-icon" mode="aspectFit"></image>
            <text>我的优惠券</text>
            <text class="menu-arrow">→</text>
        </view>
        <view class="menu-item" @click="goPickupPoints">
            <image :src="ICON.pickup" class="menu-icon" mode="aspectFit"></image>
            <text>自提点</text>
            <text class="menu-arrow">→</text>
        </view>
        <view class="menu-item" @click="logout" v-if="isLogin">
            <image :src="ICON.logout" class="menu-icon" mode="aspectFit"></image>
            <text>退出登录</text>
            <text class="menu-arrow">→</text>
        </view>
    </view>
</view>
</template>

<script>
import { useUserStore } from '@/stores/user.js'
import { ICON } from '@/common/icons.js'

export default {
    setup() { return { ICON } },
    computed: {
        isLogin() { return useUserStore().isLogin },
        userInfo() { return useUserStore().userInfo }
    },
    onShow() {
        if (useUserStore().token && !useUserStore().userInfo) {
            useUserStore().fetchUserInfo()
        }
    },
    methods: {
        goLogin() { uni.navigateTo({ url: '/pages/user/login' }) },
        goOrderList(status) { uni.navigateTo({ url: '/pages/order/list?status=' + status }) },
        goAddressList() { uni.navigateTo({ url: '/pages/user/address' }) },
        goCouponList() { uni.navigateTo({ url: '/pages/user/coupon' }) },
        goPickupPoints() { uni.showToast({ title: '开发中', icon: 'none' }) },
        logout() {
            useUserStore().logout()
            uni.showToast({ title: '已退出登录', icon: 'success' })
        }
    }
}
</script>

<style lang="scss" scoped>
.page { background: #f5f5f5; min-height: 100vh; }
.header {
    background: linear-gradient(135deg, #07c160, #06ad56);
    padding: 60rpx 30rpx 40rpx;
    .user-info { display: flex; align-items: center;
        .avatar { width: 100rpx; height: 100rpx; border-radius: 50%; border: 4rpx solid rgba(255,255,255,0.5); }
        .user-text { margin-left: 20rpx; }
        .nickname { font-size: 36rpx; color: #fff; font-weight: bold; }
        .phone { font-size: 24rpx; color: rgba(255,255,255,0.8); display: block; margin-top: 6rpx; }
        .arrow { color: #fff; font-size: 32rpx; margin-left: 12rpx; }
    }
}
.card { background: #fff; margin: 16rpx 20rpx; border-radius: 16rpx; padding: 20rpx; }
.entry-header { padding-bottom: 16rpx; }
.entry-title { font-size: 28rpx; font-weight: bold; }
.entry-more { font-size: 24rpx; color: #999; }
.entry-icons { display: flex; }
.entry-item { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 16rpx 0; }
.entry-icon-img { width: 48rpx; height: 48rpx; }
.entry-label { font-size: 22rpx; color: #666; margin-top: 8rpx; }
.menu-item { display: flex; align-items: center; padding: 24rpx 0; border-bottom: 1rpx solid #f5f5f5; font-size: 28rpx; }
.menu-icon { width: 36rpx; height: 36rpx; margin-right: 16rpx; }
.menu-arrow { color: #ccc; }
</style>
