<template>
<view class="page" v-if="order.orderNo">
    <!-- 状态 -->
    <view class="status-card">
        <image :src="getOrderStatusIcon(order.orderStatus)" class="status-icon-img" mode="aspectFit"></image>
        <text class="status-text">{{ statusText(order.orderStatus) }}</text>
        <text class="status-desc" v-if="order.orderStatus === 1">请在30分钟内完成支付</text>
    </view>

    <!-- 收货地址 -->
    <view class="card" v-if="order.deliveryType === 1 && order.addressSnapshot">
        <view class="flex-between">
            <image :src="ICON.location" class="addr-inline-icon" mode="aspectFit"></image>
            <text>{{ order.addressSnapshot }}</text>
        </view>
    </view>

    <!-- 商品明细 -->
    <view class="card">
        <view class="card-title">商品明细</view>
        <view class="order-item" v-for="item in order.items" :key="item.id">
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

    <!-- 订单信息 -->
    <view class="card">
        <view class="card-title">订单信息</view>
        <view class="info-row"><text>订单编号</text><text>{{ order.orderNo }}</text></view>
        <view class="info-row"><text>下单时间</text><text>{{ order.createTime }}</text></view>
        <view class="info-row"><text>配送方式</text><text>{{ order.deliveryType === 1 ? '配送到家' : '到店自提' }}</text></view>
        <view class="info-row" v-if="order.paymentTime"><text>支付时间</text><text>{{ order.paymentTime }}</text></view>
        <view class="info-row" v-if="order.remark"><text>备注</text><text>{{ order.remark }}</text></view>
    </view>

    <!-- 金额明细 -->
    <view class="card">
        <view class="amount-row"><text>商品总额</text><text>¥{{ order.totalAmount }}</text></view>
        <view class="amount-row"><text>配送费</text><text>¥{{ order.deliveryFee || 0 }}</text></view>
        <view class="amount-row" v-if="order.discountAmount"><text>优惠</text><text class="discount">-¥{{ order.discountAmount }}</text></view>
        <view class="amount-row total"><text>实付金额</text><text class="total-price">¥{{ order.payAmount }}</text></view>
    </view>

    <view style="height: 120rpx;"></view>

    <!-- 底部操作 -->
    <view class="bottom-bar safe-area-bottom" v-if="order.orderStatus === 1">
        <button class="action-btn cancel" @click="cancelOrder">取消订单</button>
        <button class="action-btn pay" @click="payOrder">去支付</button>
    </view>
</view>
</template>

<script>
import orderApi from '@/api/order.js'
import { getOrderStatusIcon, ICON } from '@/common/icons.js'

export default {
    setup() { return { ICON, getOrderStatusIcon } },
    data() {
        return {
            id: '',
            order: {},
            defaultImg: '/static/images/default-product.png'
        }
    },
    onLoad(options) {
        if (options.id) { this.id = options.id; this.loadData() }
    },
    methods: {
        async loadData() {
            const res = await orderApi.getOrderDetail(this.id)
            if (res.code === 200) this.order = res.data
        },
        statusText(s) {
            const map = { 1: '待付款', 2: '待发货', 3: '待收货', 4: '已签收', 5: '已完成', 6: '已取消', 7: '退款中', 8: '已退款' }
            return map[s] || '未知'
        },
        async cancelOrder() {
            uni.showModal({
                title: '提示', content: '确定取消订单？',
                success: async (res) => {
                    if (res.confirm) {
                        await orderApi.cancelOrder(this.id)
                        this.loadData()
                    }
                }
            })
        },
        payOrder() {
            uni.navigateTo({ url: '/pages/order/payment?id=' + this.id })
        }
    }
}
</script>

<style lang="scss" scoped>
.page { background: #f5f5f5; min-height: 100vh; }
.status-card { display: flex; flex-direction: column; align-items: center; padding: 40rpx; background: #07c160; color: #fff; }
.status-icon-img { width: 80rpx; height: 80rpx; }
.addr-inline-icon { width: 32rpx; height: 32rpx; margin-right: 8rpx; flex-shrink: 0; }
.status-text { font-size: 36rpx; font-weight: bold; margin-top: 12rpx; }
.status-desc { font-size: 24rpx; margin-top: 8rpx; opacity: 0.8; }
.card { background: #fff; margin: 16rpx 20rpx; border-radius: 16rpx; padding: 24rpx; }
.card-title { font-size: 28rpx; font-weight: bold; margin-bottom: 16rpx; }
.order-item { display: flex; align-items: center; padding: 16rpx 0; border-bottom: 1rpx solid #f5f5f5; }
.item-img { width: 100rpx; height: 100rpx; border-radius: 8rpx; flex-shrink: 0; }
.item-info { flex: 1; margin: 0 16rpx; .item-name { font-size: 26rpx; } .item-spec { font-size: 22rpx; color: #999; } }
.item-right { text-align: right; .item-price { font-size: 28rpx; color: #333; font-weight: bold; } .item-qty { font-size: 22rpx; color: #999; display: block; } }
.info-row { display: flex; justify-content: space-between; padding: 10rpx 0; font-size: 24rpx; color: #666; }
.amount-row { display: flex; justify-content: space-between; padding: 8rpx 0; font-size: 26rpx; color: #666; }
.amount-row.total { font-size: 30rpx; font-weight: bold; color: #333; margin-top: 10rpx; padding-top: 10rpx; border-top: 1rpx solid #f5f5f5; }
.total-price { color: #ee0a24; }
.discount { color: #ee0a24; }
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; display: flex; justify-content: flex-end; gap: 16rpx; background: #fff; padding: 20rpx 24rpx; box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05); }
.action-btn { padding: 14rpx 36rpx; border-radius: 40rpx; font-size: 28rpx; border: 1rpx solid #ddd; background: #fff; color: #666; }
.action-btn.pay { background: #07c160; color: #fff; border-color: #07c160; }
.action-btn.cancel { color: #999; }
</style>
