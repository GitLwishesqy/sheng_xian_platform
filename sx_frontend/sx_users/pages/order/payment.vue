<template>
<view class="page">
    <!-- ===== 支付成功（后端已确认收款） ===== -->
    <view v-if="status === 'paid'" class="result-wrap">
        <image :src="successIcon" class="result-icon" mode="aspectFit" @error="successIconErr = true"></image>
        <text v-if="successIconErr" class="result-emoji">✅</text>
        <text class="result-title">你已经付款成功</text>
        <text class="result-subtitle">请等待商品送达</text>
        <text class="result-amount">¥{{ payAmount.toFixed(2) }}</text>
        <button class="btn-home" @click="goHome">返回首页</button>
    </view>

    <!-- ===== 支付失败/订单取消 ===== -->
    <view v-else-if="status === 'cancelled'" class="result-wrap">
        <image :src="failIcon" class="result-icon" mode="aspectFit" @error="failIconErr = true"></image>
        <text v-if="failIconErr" class="result-emoji">❌</text>
        <text class="result-title">付款失败</text>
        <text class="result-subtitle">请你再试以下哦</text>
        <text class="result-amount">¥{{ payAmount.toFixed(2) }}</text>
        <button class="btn-retry" @click="goBack">再试一次</button>
    </view>

    <!-- ===== 等待支付 ===== -->
    <template v-else>
        <view class="amount-card">
            <text class="amount-label">应付金额</text>
            <text class="amount-value">¥{{ payAmount.toFixed(2) }}</text>
            <text class="order-no">订单号：{{ orderNo }}</text>
        </view>

        <view class="card qrcode-card">
            <view class="card-title">微信扫码支付</view>
            <view class="qrcode-tip">请使用微信扫描下方收款码完成支付</view>
            <view class="qrcode-wrap">
                <image :src="'/static/images/wx-qrcode.png'"
                       class="qrcode-img" mode="aspectFit"
                       @error="qrcodeError = true"></image>
                <view v-if="qrcodeError" class="qrcode-placeholder">
                    <text class="placeholder-icon">📱</text>
                    <text class="placeholder-text">请放入你的微信收款码</text>
                    <text class="placeholder-path">static/images/wx-qrcode.png</text>
                </view>
            </view>
        </view>

        <view class="card steps-card">
            <view class="card-title">支付步骤</view>
            <view class="step-item">
                <view class="step-num">1</view>
                <text class="step-text">打开微信扫一扫</text>
            </view>
            <view class="step-item">
                <view class="step-num">2</view>
                <text class="step-text">扫描上方收款码</text>
            </view>
            <view class="step-item">
                <view class="step-num">3</view>
                <text class="step-text">输入金额 ¥{{ payAmount.toFixed(2) }} 完成支付</text>
            </view>
            <view class="step-item">
                <view class="step-num">4</view>
                <text class="step-text">支付完成后等待系统确认收款</text>
            </view>
        </view>

        <!-- 等待确认提示 -->
        <view class="waiting-tip">
            <text>正在等待系统确认收款...</text>
            <text class="waiting-desc">收款确认后将自动跳转，请稍候</text>
        </view>

        <view style="height: 140rpx;"></view>

        <view class="bottom-bar safe-area-bottom">
            <button class="btn-back" @click="goBack">返回订单</button>
        </view>
    </template>
</view>
</template>

<script>
import orderApi from '@/api/order.js'

export default {
    data() {
        return {
            orderId: '',
            orderNo: '',
            payAmount: 0,
            status: 'pending',   // pending | paid | cancelled
            qrcodeError: false,
            successIcon: '/static/images/icon-pay-success.png',
            failIcon: '/static/images/icon-pay-fail.png',
            successIconErr: false,
            failIconErr: false,
            pollTimer: null,
            pollCount: 0
        }
    },
    onLoad(options) {
        if (options.id) {
            this.orderId = options.id
            this.orderNo = options.orderNo || ''
            if (options.amount) {
                this.payAmount = parseFloat(options.amount) || 0
            }
            if (!String(this.orderId).startsWith('LOCAL')) {
                this.loadOrder()
            }
            this.startPolling()
        }
    },
    onUnload() {
        this.clearPolling()
    },
    methods: {
        async loadOrder() {
            try {
                const res = await orderApi.getOrderDetail(this.orderId)
                if (res.code === 200 && res.data) {
                    const order = res.data
                    this.orderNo = order.orderNo || this.orderNo
                    this.payAmount = order.payAmount || this.payAmount
                    this.evaluateStatus(order.orderStatus)
                }
            } catch (e) { /* ignore */ }
        },

        startPolling() {
            if (this.pollTimer) return
            // 本地订单无法轮询后端状态
            if (String(this.orderId).startsWith('LOCAL')) return
            this.pollTimer = setInterval(() => {
                this.pollCount++
                orderApi.getOrderDetail(this.orderId).then(res => {
                    if (res.code === 200 && res.data) {
                        this.evaluateStatus(res.data.orderStatus)
                    }
                }).catch(() => {})
                // 轮询超过 10 分钟（200次×3秒）停止
                if (this.pollCount > 200) {
                    this.clearPolling()
                }
            }, 3000)
        },

        clearPolling() {
            if (this.pollTimer) {
                clearInterval(this.pollTimer)
                this.pollTimer = null
            }
        },

        evaluateStatus(orderStatus) {
            // 已支付 / 已发货 / 已收货 / 已完成 → 支付成功
            if (orderStatus === 2 || orderStatus === 3 || orderStatus === 4 || orderStatus === 5) {
                this.status = 'paid'
                this.clearPolling()
            }
            // 已取消 / 退款中 / 已退款 → 支付失败
            else if (orderStatus === 6 || orderStatus === 7 || orderStatus === 8) {
                this.status = 'cancelled'
                this.clearPolling()
            }
        },

        goHome() {
            uni.switchTab({ url: '/pages/index/index' })
        },
        goBack() {
            this.clearPolling()
            uni.navigateBack()
        }
    }
}
</script>

<style lang="scss" scoped>
.page { background: #f5f5f5; min-height: 100vh; }

/* 结果页 */
.result-wrap {
    background: #fff; min-height: 100vh;
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 60rpx;
}
.result-icon { width: 160rpx; height: 160rpx; margin-bottom: 30rpx; }
.result-emoji { font-size: 100rpx; margin-bottom: 30rpx; }
.result-title { font-size: 34rpx; font-weight: bold; color: #333; margin-bottom: 14rpx; }
.result-subtitle { font-size: 26rpx; color: #999; margin-bottom: 30rpx; }
.result-amount { font-size: 44rpx; color: #ee0a24; font-weight: bold; margin-bottom: 50rpx; }
.btn-home {
    width: 400rpx; background: #07c160; color: #fff;
    border: none; border-radius: 40rpx; padding: 18rpx 0; font-size: 30rpx; text-align: center;
}
.btn-retry {
    width: 400rpx; background: #07c160; color: #fff;
    border: none; border-radius: 40rpx; padding: 18rpx 0; font-size: 30rpx; text-align: center;
}

/* 金额卡片 */
.amount-card {
    background: linear-gradient(135deg, #07c160, #06ad56);
    margin: 20rpx 20rpx 16rpx;
    border-radius: 16rpx; padding: 40rpx 30rpx; color: #fff;
    display: flex; flex-direction: column; align-items: center;
    .amount-label { font-size: 26rpx; opacity: 0.9; }
    .amount-value { font-size: 60rpx; font-weight: bold; margin: 12rpx 0; }
    .order-no { font-size: 22rpx; opacity: 0.7; }
}

.card { background: #fff; margin: 0 20rpx 16rpx; border-radius: 16rpx; padding: 24rpx; }
.card-title { font-size: 28rpx; font-weight: bold; margin-bottom: 16rpx; text-align: center; }

.qrcode-card { display: flex; flex-direction: column; align-items: center; }
.qrcode-tip { font-size: 24rpx; color: #666; margin-bottom: 20rpx; text-align: center; }
.qrcode-wrap {
    width: 400rpx; height: 400rpx;
    display: flex; align-items: center; justify-content: center;
    background: #fafafa; border: 2rpx dashed #ddd; border-radius: 12rpx;
}
.qrcode-img { width: 100%; height: 100%; border-radius: 12rpx; }
.qrcode-placeholder {
    display: flex; flex-direction: column; align-items: center; padding: 40rpx;
    .placeholder-icon { font-size: 80rpx; margin-bottom: 20rpx; }
    .placeholder-text { font-size: 26rpx; color: #999; margin-bottom: 10rpx; }
    .placeholder-path { font-size: 22rpx; color: #bbb; }
}

.steps-card { margin-top: 0; }
.step-item {
    display: flex; align-items: center; padding: 16rpx 0;
    border-bottom: 1rpx solid #f5f5f5;
    &:last-child { border-bottom: none; }
}
.step-num {
    width: 44rpx; height: 44rpx; border-radius: 50%;
    background: #07c160; color: #fff; font-size: 24rpx;
    display: flex; align-items: center; justify-content: center;
    margin-right: 16rpx; flex-shrink: 0;
}
.step-text { font-size: 26rpx; color: #333; }

.waiting-tip {
    text-align: center; padding: 30rpx 20rpx;
    font-size: 26rpx; color: #07c160;
    .waiting-desc { display: block; font-size: 22rpx; color: #999; margin-top: 8rpx; }
}

.bottom-bar {
    position: fixed; bottom: 0; left: 0; right: 0;
    display: flex; gap: 16rpx;
    background: #fff; padding: 20rpx 24rpx;
    box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
}
.btn-back {
    flex: 1; background: #07c160; color: #fff; border: none;
    border-radius: 40rpx; padding: 18rpx 0; font-size: 30rpx;
}
</style>
