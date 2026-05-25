<template>
<view class="page">
    <!-- 状态Tab -->
    <view class="tabs">
        <view v-for="(tab, idx) in tabs" :key="idx"
              :class="['tab-item', currentTab === tab.value ? 'active' : '']"
              @click="switchTab(tab.value)">
            {{ tab.label }}
        </view>
    </view>

    <!-- 订单列表 -->
    <scroll-view class="order-scroll" scroll-y @scrolltolower="loadMore">
        <view class="order-card" v-for="order in orders" :key="order.id"
              @click="goDetail(order.id)">
            <view class="order-header">
                <text class="order-no">订单号：{{ order.orderNo }}</text>
                <text :class="['order-status', 'status-' + order.orderStatus]">{{ statusText(order.orderStatus) }}</text>
            </view>
            <view class="order-item" v-for="item in (order.items || [])" :key="item.id">
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
            <view class="order-footer">
                <text class="order-total">共{{ order.items ? order.items.length : 0 }}件 实付：</text>
                <text class="total-price">¥{{ order.payAmount }}</text>
            </view>
            <!-- 操作按钮 -->
            <view class="actions" v-if="order.orderStatus === 1">
                <button class="action-btn cancel" @click.stop="cancelOrder(order)">取消订单</button>
                <button class="action-btn pay" @click.stop="payOrder(order)">去支付</button>
            </view>
            <view class="actions" v-else-if="order.orderStatus === 3">
                <button class="action-btn confirm" @click.stop="confirmOrder(order)">确认收货</button>
            </view>
            <view class="actions" v-else-if="order.orderStatus === 2">
                <button class="action-btn refund" @click.stop="applyRefund(order)">申请退款</button>
            </view>
        </view>
        <view class="load-more-wrap" v-if="loading"><text>加载中...</text></view>
        <view class="load-more-wrap" v-if="noMore && orders.length > 0"><text>— 没有更多了 —</text></view>
        <view v-if="!loading && orders.length === 0" class="empty-tip">
            <image :src="ICON.pendingDelivery" class="empty-icon-img" mode="aspectFit"></image>
            <text>暂无订单</text>
        </view>
    </scroll-view>
</view>
</template>

<script>
import orderApi from '@/api/order.js'
import { ICON } from '@/common/icons.js'

export default {
    setup() { return { ICON } },
    data() {
        return {
            tabs: [
                { label: '全部', value: '' },
                { label: '待付款', value: '1' },
                { label: '待发货', value: '2' },
                { label: '待收货', value: '3' },
                { label: '已完成', value: '5' },
            ],
            currentTab: '',
            orders: [],
            page: 1,
            loading: false,
            noMore: false,
            defaultImg: '/static/images/default-product.png'
        }
    },
    onShow() { this.page = 1; this.noMore = false; this.orders = []; this.loadOrders() },
    methods: {
        async loadOrders() {
            if (this.loading || this.noMore) return
            this.loading = true
            try {
                const params = { page: this.page, pageSize: 10 }
                if (this.currentTab) params.orderStatus = parseInt(this.currentTab)
                const res = await orderApi.getOrderList(params)
                if (res.code === 200) {
                    const data = res.data
                    this.orders = this.page === 1 ? data.records : [...this.orders, ...data.records]
                    this.noMore = data.records.length < 10
                }
            } finally { this.loading = false }
        },
        switchTab(val) {
            this.currentTab = val; this.page = 1; this.noMore = false; this.orders = []
            this.loadOrders()
        },
        loadMore() { this.page++; this.loadOrders() },
        goDetail(id) { uni.navigateTo({ url: '/pages/order/detail?id=' + id }) },
        statusText(status) {
            const map = { 1: '待付款', 2: '待发货', 3: '待收货', 4: '已签收', 5: '已完成', 6: '已取消', 7: '退款中', 8: '已退款' }
            return map[status] || '未知'
        },
        async cancelOrder(order) {
            uni.showModal({
                title: '提示', content: '确定取消订单？',
                success: async (res) => {
                    if (res.confirm) {
                        await orderApi.cancelOrder(order.id)
                        uni.showToast({ title: '已取消', icon: 'success' })
                        this.page = 1; this.noMore = false; this.orders = []; this.loadOrders()
                    }
                }
            })
        },
        payOrder(order) {
            uni.navigateTo({ url: '/pages/order/payment?id=' + order.id })
        },
        async confirmOrder(order) {
            uni.showModal({
                title: '提示', content: '确认已收到商品？',
                success: async (res) => {
                    if (res.confirm) {
                        await orderApi.confirmReceive(order.id)
                        uni.showToast({ title: '已确认收货', icon: 'success' })
                        this.page = 1; this.noMore = false; this.orders = []; this.loadOrders()
                    }
                }
            })
        },
        applyRefund(order) {
            uni.navigateTo({ url: '/pages/order/refund?id=' + order.id })
        }
    }
}
</script>

<style lang="scss" scoped>
.page { background: #f5f5f5; min-height: 100vh; }
.tabs { display: flex; background: #fff; position: sticky; top: 0; z-index: 10; padding: 0 10rpx; }
.tab-item { flex: 1; text-align: center; padding: 24rpx 0; font-size: 26rpx; color: #666; }
.tab-item.active { color: #07c160; font-weight: bold; border-bottom: 4rpx solid #07c160; }

.order-scroll { padding: 16rpx 20rpx; }
.order-card { background: #fff; border-radius: 16rpx; margin-bottom: 16rpx; padding: 20rpx; }
.order-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 16rpx; border-bottom: 1rpx solid #f5f5f5; }
.order-no { font-size: 24rpx; color: #999; }
.order-status { font-size: 24rpx; font-weight: bold; }
.status-1 { color: #ff976a; } .status-2 { color: #1989fa; } .status-3 { color: #07c160; }
.status-5 { color: #999; } .status-6 { color: #ccc; } .status-7 { color: #ee0a24; }

.order-item { display: flex; align-items: center; padding: 16rpx 0; border-bottom: 1rpx solid #f5f5f5; }
.item-img { width: 100rpx; height: 100rpx; border-radius: 8rpx; flex-shrink: 0; }
.item-info { flex: 1; margin: 0 16rpx; .item-name { font-size: 26rpx; } .item-spec { font-size: 22rpx; color: #999; } }
.item-right { text-align: right; .item-price { font-size: 28rpx; color: #333; font-weight: bold; } .item-qty { font-size: 22rpx; color: #999; display: block; } }
.order-footer { text-align: right; padding: 16rpx 0; font-size: 26rpx; }
.order-total { color: #666; }
.total-price { color: #ee0a24; font-size: 32rpx; font-weight: bold; }
.actions { display: flex; justify-content: flex-end; gap: 16rpx; padding-top: 12rpx; }
.action-btn { padding: 10rpx 28rpx; border-radius: 30rpx; font-size: 24rpx; border: 1rpx solid #ddd; background: #fff; color: #666; }
.action-btn.pay { background: #07c160; color: #fff; border-color: #07c160; }
.action-btn.confirm { background: #07c160; color: #fff; border-color: #07c160; }
.action-btn.cancel { color: #999; }
.action-btn.refund { color: #ee0a24; border-color: #ee0a24; }
.load-more-wrap { display: flex; justify-content: center; align-items: center; padding: 20rpx 0; }
.load-more-wrap text { color: #ccc; font-size: 24rpx; }
.empty-tip { display: flex; flex-direction: column; align-items: center; padding: 200rpx 0; color: #999; .empty-icon-img { width: 100rpx; height: 100rpx; margin-bottom: 20rpx; } }
</style>
