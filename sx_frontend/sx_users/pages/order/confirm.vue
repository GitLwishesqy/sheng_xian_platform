<template>
<view class="page">
    <!-- 收货地址 -->
    <view class="card" @click="goAddress">
        <view v-if="selectedAddress" class="address-info">
            <view class="addr-top">
                <text class="addr-name">{{ selectedAddress.receiverName }}</text>
                <text class="addr-phone">{{ selectedAddress.receiverPhone }}</text>
                <text class="addr-tag" v-if="selectedAddress.isDefault">默认</text>
            </view>
            <text class="addr-detail">{{ selectedAddress.province }}{{ selectedAddress.city }}{{ selectedAddress.district }} {{ selectedAddress.detailAddress }}</text>
        </view>
        <view v-else class="no-addr">
            <image :src="ICON.location" class="addr-icon-img" mode="aspectFit"></image>
            <text>请选择收货地址</text>
            <text class="addr-arrow">→</text>
        </view>
    </view>

    <!-- 配送方式 -->
    <view class="card">
        <view class="card-title">配送方式</view>
        <view class="delivery-options">
            <view :class="['delivery-item', deliveryType === 1 ? 'active' : '']" @click="setDelivery(1)">
                <image :src="ICON.homeDelivery" class="delivery-icon" mode="aspectFit"></image>
                <text>配送到家</text>
            </view>
            <view :class="['delivery-item', deliveryType === 2 ? 'active' : '']" @click="setDelivery(2)">
                <image :src="ICON.selfPickup" class="delivery-icon" mode="aspectFit"></image>
                <text>到店自提</text>
            </view>
        </view>
    </view>

    <!-- 商品明细 -->
    <view class="card">
        <view class="card-title">商品明细</view>
        <view class="order-item" v-for="item in orderItems" :key="item.productId">
            <image :src="item.productImage || defaultImg" mode="aspectFill" class="item-img"></image>
            <view class="item-info">
                <text class="item-name text-ellipsis-2">{{ item.productName }}</text>
                <text class="item-spec" v-if="item.specInfo">{{ item.specInfo }}</text>
            </view>
            <view class="item-right">
                <text class="item-price">¥{{ item.price }}</text>
                <text class="item-qty">x{{ item.quantity }}</text>
            </view>
        </view>
    </view>

    <!-- 优惠券 -->
    <view class="card" @click="goCoupon">
        <view class="flex-between">
            <text>优惠券</text>
            <text class="card-arrow">
                {{ selectedCoupon ? '¥' + selectedCoupon.discountValue : '选择优惠券' }} →
            </text>
        </view>
    </view>

    <!-- 金额明细 -->
    <view class="card">
        <view class="amount-row"><text>商品总额</text><text>¥{{ totalAmount.toFixed(2) }}</text></view>
        <view class="amount-row"><text>配送费</text><text>¥{{ deliveryFee.toFixed(2) }}</text></view>
        <view class="amount-row" v-if="discountAmount > 0"><text>优惠</text><text class="discount">-¥{{ discountAmount.toFixed(2) }}</text></view>
    </view>

    <view style="height: 140rpx;"></view>

    <!-- 底部提交 -->
    <view class="bottom-bar safe-area-bottom">
        <view class="total">
            <text>实付：</text>
            <text class="total-price">¥{{ payAmount.toFixed(2) }}</text>
        </view>
        <button class="btn-submit" :loading="submitting" :disabled="submitting" @click="submitOrder">{{ submitting ? '提交中...' : '提交订单' }}</button>
    </view>
</view>
</template>

<script>
import addressApi from '@/api/address.js'
import orderApi from '@/api/order.js'
import http from '@/api/request.js'
import { ICON } from '@/common/icons.js'

export default {
    setup() { return { ICON } },
    data() {
        return {
            orderItems: [],
            selectedAddress: null,
            deliveryType: 1,
            deliveryFee: 5,
            totalAmount: 0,
            discountAmount: 0,
            payAmount: 0,
            selectedCoupon: null,
            remark: '',
            submitting: false,
            defaultImg: '/static/images/default-product.png'
        }
    },
    onLoad(options) {
        if (options.items) {
            try { this.orderItems = JSON.parse(decodeURIComponent(options.items)) }
            catch { this.orderItems = [] }
        }
        this.calcAmount()
        this.loadAddress().catch(() => {})
        this.loadItemImages().catch(() => {})
    },
    onShow() {
        this.submitting = false
    },
    methods: {
        async loadAddress() {
            try {
                const res = await addressApi.getAddressList()
                if (res.code === 200) {
                    const list = res.data || []
                    this.selectedAddress = list.find(a => a.isDefault) || list[0] || null
                }
            } catch (e) { /* ignore */ }
        },
        calcAmount() {
            this.totalAmount = this.orderItems.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0)
            this.payAmount = this.totalAmount + this.deliveryFee - this.discountAmount
        },
        goAddress() { uni.navigateTo({ url: '/pages/user/address?mode=select' }) },
        goCoupon() { uni.navigateTo({ url: '/pages/user/coupon?mode=select&amount=' + this.totalAmount }) },
        setDelivery(type) {
            this.deliveryType = type
            this.deliveryFee = type === 1 ? 5 : 0
            this.calcAmount()
        },
        async loadItemImages() {
            for (const item of this.orderItems) {
                if (!item.productImage && item.productId) {
                    try {
                        const res = await http.get('/api/v1/product/' + item.productId, {}, true)
                        if (res.code === 200 && res.data) {
                            item.productImage = res.data.coverImage || ''
                        }
                    } catch (e) { /* ignore */ }
                }
            }
        },
        async submitOrder() {
            if (this.submitting) return
            if (!this.selectedAddress && this.deliveryType === 1) {
                uni.showToast({ title: '请选择收货地址', icon: 'none' }); return
            }
            this.submitting = true
            const data = {
                deliveryType: this.deliveryType,
                items: this.orderItems.map(i => ({
                    productId: i.productId, skuId: i.skuId, quantity: i.quantity || 1
                })),
                remark: this.remark
            }
            if (this.deliveryType === 1 && this.selectedAddress) data.addressId = this.selectedAddress.id
            if (this.selectedCoupon) data.couponId = this.selectedCoupon.id

            try {
                const res = await orderApi.createOrder(data)
                if (res.code === 200 && res.data && res.data.id) {
                    uni.showToast({ title: '下单成功', icon: 'success' })
                    this.$nextTick(() => {
                        uni.navigateTo({ url: '/pages/order/payment?id=' + res.data.id })
                    })
                    return
                }
            } catch (e) {
                uni.showToast({ title: '网络异常，请检查后端服务', icon: 'none' })
            }
            this.submitting = false
        }
    }
}
</script>

<style lang="scss" scoped>
.page { background: #f5f5f5; min-height: 100vh; }
.card { background: #fff; margin: 16rpx 20rpx; border-radius: 16rpx; padding: 24rpx; }
.card-title { font-size: 28rpx; font-weight: bold; margin-bottom: 16rpx; }

.address-info { .addr-top { display: flex; align-items: center; gap: 12rpx; }
    .addr-name { font-size: 30rpx; font-weight: bold; }
    .addr-phone { font-size: 26rpx; color: #666; }
    .addr-tag { font-size: 20rpx; color: #07c160; background: #e8f8ee; padding: 2rpx 10rpx; border-radius: 4rpx; }
    .addr-detail { font-size: 24rpx; color: #999; display: block; margin-top: 8rpx; }
}
.no-addr { display: flex; align-items: center; font-size: 28rpx; color: #999; .addr-icon-img { width: 32rpx; height: 32rpx; margin-right: 12rpx; } .addr-arrow { margin-left: auto; } }
.delivery-options { display: flex; gap: 20rpx; }
.delivery-item { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8rpx; padding: 20rpx; background: #f5f5f5; border-radius: 12rpx; font-size: 26rpx; }
.delivery-icon { width: 32rpx; height: 32rpx; }
.delivery-item.active { background: #e8f8ee; color: #07c160; border: 2rpx solid #07c160; }
.order-item { display: flex; align-items: center; padding: 16rpx 0; border-bottom: 1rpx solid #f5f5f5; }
.item-img { width: 100rpx; height: 100rpx; border-radius: 10rpx; flex-shrink: 0; }
.item-info { flex: 1; margin: 0 16rpx; .item-name { font-size: 26rpx; } .item-spec { font-size: 22rpx; color: #999; } }
.item-right { text-align: right; .item-price { font-size: 28rpx; color: #ee0a24; font-weight: bold; } .item-qty { font-size: 22rpx; color: #999; display: block; } }
.card-arrow { color: #999; font-size: 26rpx; }
.amount-row { display: flex; justify-content: space-between; padding: 8rpx 0; font-size: 26rpx; color: #666; }
.discount { color: #ee0a24; }

.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; display: flex; align-items: center; background: #fff; padding: 20rpx 24rpx; box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05); }
.total { flex: 1; font-size: 28rpx; }
.total-price { color: #ee0a24; font-size: 36rpx; font-weight: bold; }
.btn-submit { background: #07c160; color: #fff; border: none; border-radius: 40rpx; padding: 18rpx 48rpx; font-size: 30rpx; }
</style>
