<template>
<view class="page">
    <!-- 管理按钮 -->
    <view class="header-bar" v-if="cartList.length > 0">
        <text class="title">购物车</text>
        <text class="manage-btn" @click="editMode = !editMode">{{ editMode ? '完成' : '管理' }}</text>
    </view>

    <!-- 购物车列表 -->
    <scroll-view class="cart-scroll" scroll-y v-if="cartList.length > 0">
        <view class="cart-item" v-for="item in cartList" :key="item.id">
            <view class="check-box" @click="onCheck(item)">
                <image :src="item.selected ? ICON.checked : ICON.unchecked"
                       class="check-icon" mode="aspectFit"></image>
            </view>
            <image :src="item.productImage || defaultImg" mode="aspectFill" class="item-img" @click="goDetail(item.productId)"></image>
            <view class="item-info">
                <text class="item-name text-ellipsis-2">{{ item.productName || '商品' }}</text>
                <text class="item-spec" v-if="item.specInfo">{{ item.specInfo }}</text>
                <view class="item-bottom">
                    <view class="price">
                        <text class="price-symbol">¥</text>
                        <text class="price-value">{{ item.price }}</text>
                    </view>
                    <view class="quantity-ctl">
                        <text class="qty-btn" @click="decrease(item)">−</text>
                        <text class="qty-num">{{ item.quantity }}</text>
                        <text class="qty-btn" @click="increase(item)">+</text>
                    </view>
                </view>
            </view>
        </view>
        <view style="height: 120rpx;"></view>
    </scroll-view>

    <!-- 空购物车 -->
    <view class="empty-cart" v-else>
        <image :src="ICON.cart" class="empty-icon-img" mode="aspectFit"></image>
        <text class="empty-text">购物车是空的</text>
        <button class="btn-primary" @click="goHome">去逛逛</button>
    </view>

    <!-- 底部结算栏 -->
    <view class="bottom-bar safe-area-bottom" v-if="cartList.length > 0">
        <view class="bar-left" @click="onCheckAll">
            <image :src="isAllSelected ? ICON.checked : ICON.unchecked"
                   class="check-icon" mode="aspectFit"></image>
            <text>全选</text>
        </view>
        <view class="total-area" v-if="!editMode">
            <text>合计：</text>
            <text class="total-price">¥{{ totalPrice.toFixed(2) }}</text>
        </view>
        <view class="bar-right" v-if="!editMode">
            <button class="btn-settle" @click="goSettle" :disabled="selectedItems.length === 0">结算({{ selectedCount }})</button>
        </view>
        <button class="btn-delete" v-else @click="deleteSelected">删除({{ selectedItems.length }})</button>
    </view>
</view>
</template>

<script>
import { useCartStore } from '@/stores/cart.js'
import { ICON } from '@/common/icons.js'

export default {
    setup() { return { ICON } },
    data() {
        return { editMode: false, defaultImg: '/static/images/default-product.png' }
    },
    computed: {
        cartList() { return useCartStore().cartList },
        selectedItems() { return useCartStore().selectedItems },
        selectedCount() { return (useCartStore().selectedItems || []).length },
        isAllSelected() { return useCartStore().isAllSelected },
        totalPrice() { return useCartStore().totalPrice }
    },
    onShow() { useCartStore().fetchCartList() },
    methods: {
        goDetail(id) { uni.navigateTo({ url: '/pages/product/detail?id=' + id }) },
        goHome() { uni.switchTab({ url: '/pages/index/index' }) },
        onCheck(item) { useCartStore().toggleSelect(item.id, item.selected ? 0 : 1) },
        onCheckAll() { useCartStore().selectAll(this.isAllSelected ? 0 : 1) },
        increase(item) { useCartStore().updateQuantity(item.id, item.quantity + 1) },
        decrease(item) {
            if (item.quantity <= 1) {
                uni.showModal({
                    title: '提示', content: '确定删除该商品？',
                    success: (res) => { if (res.confirm) useCartStore().removeItem(item.id) }
                })
            } else {
                useCartStore().updateQuantity(item.id, item.quantity - 1)
            }
        },
        deleteSelected() {
            if (this.selectedItems.length === 0) return
            uni.showModal({
                title: '提示', content: '确定删除选中商品？',
                success: (res) => {
                    if (res.confirm) this.selectedItems.forEach(i => useCartStore().removeItem(i.id))
                }
            })
        },
        goSettle() {
            const items = this.selectedItems.map(i => ({
                productId: i.productId,
                skuId: i.skuId,
                quantity: i.quantity,
                price: i.price,
                productName: i.productName || '商品',
                productImage: i.productImage || '',
                specInfo: i.specInfo || ''
            }))
            uni.navigateTo({ url: '/pages/order/confirm?items=' + encodeURIComponent(JSON.stringify(items)) })
        }
    }
}
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: #f5f5f5; }
.header-bar { display: flex; justify-content: space-between; align-items: center; padding: 20rpx 24rpx; background: #fff;
    .title { font-size: 32rpx; font-weight: bold; }
    .manage-btn { font-size: 26rpx; color: #07c160; }
}
.cart-scroll { height: calc(100vh - 100rpx); }
.cart-item { display: flex; align-items: center; background: #fff; margin: 12rpx 20rpx; border-radius: 16rpx; padding: 20rpx; }
.check-box { margin-right: 16rpx; }
.check-icon { width: 40rpx; height: 40rpx; }
.item-img { width: 160rpx; height: 160rpx; border-radius: 12rpx; flex-shrink: 0; }
.item-info { flex: 1; margin-left: 16rpx; display: flex; flex-direction: column; justify-content: space-between; min-height: 160rpx; }
.item-name { font-size: 26rpx; color: #333; }
.item-spec { font-size: 22rpx; color: #999; }
.item-bottom { display: flex; justify-content: space-between; align-items: center; }
.price { color: #ee0a24; }
.price-symbol { font-size: 22rpx; font-weight: bold; }
.price-value { font-size: 32rpx; font-weight: bold; }
.quantity-ctl { display: flex; align-items: center; gap: 4rpx; }
.qty-btn { width: 48rpx; height: 48rpx; border-radius: 50%; text-align: center; line-height: 48rpx; font-size: 28rpx; background: #f5f5f5; }
.qty-num { width: 60rpx; text-align: center; font-size: 28rpx; }

.empty-cart { display: flex; flex-direction: column; align-items: center; padding-top: 200rpx;
    .empty-icon-img { width: 120rpx; height: 120rpx; }
    .empty-text { font-size: 28rpx; color: #999; margin: 30rpx 0; }
}

.bottom-bar { position: fixed; left: 0; right: 0; z-index: 10; display: flex; align-items: center; background: #fff; padding: 16rpx 0 16rpx 24rpx; box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05); }
/* #ifdef H5 */
.bottom-bar { bottom: calc(50px + env(safe-area-inset-bottom, 0px)); }
/* #endif */
/* #ifndef H5 */
.bottom-bar { bottom: 0; }
/* #endif */
.bar-left { display: flex; align-items: center; font-size: 26rpx; flex-shrink: 0; }
.total-area { flex: 1; display: flex; align-items: center; justify-content: flex-end; padding-right: 16rpx; font-size: 26rpx; }
.bar-right { width: 25%; display: flex; align-items: center; justify-content: center; }
.total-price { color: #ee0a24; font-size: 32rpx; font-weight: bold; }
.btn-settle { background: #07c160; color: #fff; border: none; border-radius: 40rpx; padding: 16rpx 36rpx; font-size: 28rpx; }
.btn-settle[disabled] { background: #ccc; }
.btn-delete { background: #ee0a24; color: #fff; border: none; border-radius: 40rpx; padding: 16rpx 36rpx; font-size: 28rpx; margin-left: auto; }
</style>
