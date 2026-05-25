<template>
<view class="page">
    <view class="result-box">
        <image :src="iconPath" class="result-icon" mode="aspectFit" @error="iconError = true"></image>
        <text v-if="iconError" class="result-emoji">❌</text>
        <text class="result-title">付款失败</text>
        <text class="result-subtitle">请你再试以下哦</text>
        <text class="result-amount" v-if="payAmount > 0">¥{{ payAmount.toFixed(2) }}</text>
        <button class="btn-retry" @click="goBack">再试一次</button>
    </view>
</view>
</template>

<script>
export default {
    data() {
        return {
            iconPath: '/static/images/icon-pay-fail.png',
            iconError: false,
            payAmount: 0
        }
    },
    onLoad(options) {
        if (options.amount) {
            this.payAmount = parseFloat(options.amount) || 0
        }
    },
    methods: {
        goBack() {
            uni.navigateBack()
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    background: #fff; min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
}
.result-box {
    display: flex; flex-direction: column; align-items: center;
    padding: 60rpx;
}
.result-icon {
    width: 160rpx; height: 160rpx; margin-bottom: 30rpx;
}
.result-emoji {
    font-size: 100rpx; margin-bottom: 30rpx;
}
.result-title {
    font-size: 34rpx; font-weight: bold; color: #333;
    margin-bottom: 14rpx;
}
.result-subtitle {
    font-size: 26rpx; color: #999; margin-bottom: 30rpx;
}
.result-amount {
    font-size: 44rpx; color: #ee0a24; font-weight: bold;
    margin-bottom: 50rpx;
}
.btn-retry {
    width: 400rpx; background: #07c160; color: #fff;
    border: none; border-radius: 40rpx;
    padding: 18rpx 0; font-size: 30rpx; text-align: center;
}
</style>
