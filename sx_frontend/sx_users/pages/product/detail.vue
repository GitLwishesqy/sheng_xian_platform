<template>
<view class="page" v-if="product.name">
    <!-- 图片轮播 -->
    <swiper class="img-swiper" indicator-dots circular v-if="imgList.length > 1">
        <swiper-item v-for="(url, i) in imgList" :key="i">
            <image :src="url" mode="aspectFill" class="swiper-img"></image>
        </swiper-item>
    </swiper>
    <image v-else :src="imgList.length === 1 ? imgList[0] : (product.coverImage || defaultImg)" mode="aspectFill" class="single-img"></image>

    <!-- 商品信息 -->
    <view class="info-card">
        <view class="price-line">
            <text class="price-symbol">¥</text>
            <text class="price-value">{{ skuPrice || product.price }}</text>
            <text class="price-old" v-if="product.originalPrice">¥{{ product.originalPrice }}</text>
        </view>
        <text class="product-title">{{ product.name }}</text>
        <text class="product-subtitle" v-if="product.subtitle">{{ product.subtitle }}</text>
        <view class="meta-line">
            <text>销量 {{ product.sales || 0 }}</text>
            <text>库存 {{ skuStock !== null ? skuStock : product.stock }}</text>
            <text v-if="product.unit">/{{ product.unit }}</text>
        </view>
        <view class="tags" v-if="product.storageCondition">
            <text class="tag">{{ product.storageCondition }}</text>
            <text class="tag" v-if="product.shelfLife">保质期{{ product.shelfLife }}天</text>
        </view>
    </view>

    <!-- SKU选择 -->
    <view class="sku-card" v-if="skuList.length > 0">
        <text class="card-title">规格选择</text>
        <view class="sku-list">
            <view v-for="sku in skuList" :key="sku.id"
                  :class="['sku-item', selectedSkuId === sku.id ? 'active' : '']"
                  @click="selectSku(sku)">
                <text>{{ sku.specValue }}{{ sku.specName ? ' ' + sku.specName : '' }}</text>
                <text v-if="sku.price !== product.price"> ¥{{ sku.price }}</text>
            </view>
        </view>
    </view>

    <!-- 商品详情 -->
    <view class="detail-card" v-if="product.detail">
        <text class="card-title">商品详情</text>
        <rich-text :nodes="product.detail"></rich-text>
    </view>

    <!-- 评价 -->
    <view class="review-card">
        <text class="card-title">用户评价 ({{ reviewCount }})</text>
        <view v-if="reviews.length === 0" class="empty-tip">暂无评价</view>
        <view v-for="rv in reviews" :key="rv.id" class="review-item">
            <view class="review-header">
                <text class="review-user">{{ rv.userId }}</text>
                <text class="review-stars">{{ '★'.repeat(rv.rating) }}{{ '☆'.repeat(5 - rv.rating) }}</text>
            </view>
            <text class="review-content" v-if="rv.content">{{ rv.content }}</text>
        </view>
    </view>

    <view style="height: 120rpx;"></view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar safe-area-bottom">
        <view class="bar-left">
            <view class="bar-btn" @click="goCart">
                <image :src="ICON.cart" class="bar-icon-img" mode="aspectFit"></image>
                <text>购物车</text>
                <text class="cart-badge" v-if="cartCount">{{ cartCount }}</text>
            </view>
        </view>
        <button class="btn-add" @click="addToCart">加入购物车</button>
        <button class="btn-buy" @click="buyNow">立即购买</button>
    </view>
</view>
</template>

<script>
import productApi from '@/api/product.js'
import { useCartStore } from '@/stores/cart.js'
import { ICON } from '@/common/icons.js'

export default {
    setup() { return { ICON } },
    data() {
        return {
            id: '',
            product: {},
            skuList: [],
            selectedSkuId: null,
            skuPrice: null,
            skuStock: null,
            reviews: [],
            reviewCount: 0,
            defaultImg: '/static/images/default-product.png'
        }
    },
    computed: {
        imgList() {
            if (!this.product.images) return []
            try { return typeof this.product.images === 'string' ? JSON.parse(this.product.images) : this.product.images }
            catch { return [] }
        },
        cartCount() { return useCartStore().cartCount }
    },
    onLoad(options) {
        if (options.id) {
            this.id = options.id
            this.loadData()
        }
    },
    methods: {
        async loadData() {
            try {
                const res = await productApi.getProductDetail(this.id)
                if (res.code === 200) {
                    this.product = res.data
                    // 获取SKU
                    if (res.data.skuList) this.skuList = res.data.skuList
                }
                // 获取评价
                const revRes = await productApi.getProductReviews(this.id, { page: 1, pageSize: 3 })
                if (revRes.code === 200) {
                    this.reviews = revRes.data.records || []
                    this.reviewCount = revRes.data.total || 0
                }
            } catch (e) { console.error('加载商品详情失败', e) }
        },
        selectSku(sku) {
            this.selectedSkuId = sku.id
            this.skuPrice = sku.price
            this.skuStock = sku.stock
        },
        addToCart() {
            const data = { productId: this.product.id, quantity: 1 }
            if (this.selectedSkuId) data.skuId = this.selectedSkuId
            useCartStore().addToCart(data).then(() => {
                uni.showToast({ title: '已加入购物车', icon: 'success' })
            })
        },
        buyNow() {
            const data = { productId: this.product.id, quantity: 1 }
            if (this.selectedSkuId) data.skuId = this.selectedSkuId
            const items = [data]
            uni.navigateTo({ url: '/pages/order/confirm?items=' + encodeURIComponent(JSON.stringify(items)) })
        },
        goCart() { uni.switchTab({ url: '/pages/cart/cart' }) }
    }
}
</script>

<style lang="scss" scoped>
.img-swiper { width: 100%; height: 600rpx; .swiper-img { width: 100%; height: 100%; } }
.single-img { width: 100%; height: 600rpx; }
.info-card, .sku-card, .detail-card, .review-card {
    background: #fff; margin: 16rpx 20rpx; border-radius: 16rpx; padding: 24rpx;
}
.price-line { margin-bottom: 12rpx; color: #ee0a24; }
.price-symbol { font-size: 28rpx; font-weight: bold; }
.price-value { font-size: 44rpx; font-weight: bold; }
.price-old { font-size: 24rpx; color: #999; text-decoration: line-through; margin-left: 12rpx; }
.product-title { font-size: 32rpx; font-weight: bold; color: #333; display: block; }
.product-subtitle { font-size: 24rpx; color: #999; display: block; margin-top: 8rpx; }
.meta-line { display: flex; gap: 24rpx; margin-top: 12rpx; font-size: 22rpx; color: #999; }
.tags { margin-top: 12rpx; }
.tag { font-size: 20rpx; color: #07c160; background: #e8f8ee; padding: 4rpx 12rpx; border-radius: 8rpx; margin-right: 8rpx; }
.card-title { font-size: 28rpx; font-weight: bold; margin-bottom: 16rpx; display: block; }
.sku-list { display: flex; flex-wrap: wrap; gap: 16rpx; }
.sku-item { padding: 12rpx 24rpx; background: #f5f5f5; border-radius: 8rpx; font-size: 24rpx; color: #666; }
.sku-item.active { background: #e8f8ee; color: #07c160; border: 2rpx solid #07c160; }
.empty-tip { text-align: center; color: #999; padding: 40rpx 0; font-size: 24rpx; }
.review-item { padding: 16rpx 0; border-bottom: 1rpx solid #f5f5f5; }
.review-header { display: flex; justify-content: space-between; }
.review-user { font-size: 24rpx; color: #333; }
.review-stars { color: #ff976a; font-size: 24rpx; }
.review-content { font-size: 24rpx; color: #666; display: block; margin-top: 8rpx; }

.bottom-bar {
    position: fixed; bottom: 0; left: 0; right: 0;
    display: flex; align-items: center; background: #fff;
    padding: 16rpx 20rpx; box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
    .bar-btn { display: flex; flex-direction: column; align-items: center; font-size: 20rpx; color: #666; position: relative; padding: 0 20rpx; }
    .bar-icon-img { width: 40rpx; height: 40rpx; }
    .cart-badge {
        position: absolute; top: -4rpx; right: 6rpx;
        background: #ee0a24; color: #fff; font-size: 18rpx;
        min-width: 28rpx; height: 28rpx; border-radius: 14rpx;
        text-align: center; line-height: 28rpx; padding: 0 6rpx;
    }
    .btn-add { flex: 1; background: #ff976a; color: #fff; border: none; border-radius: 40rpx; padding: 20rpx; font-size: 28rpx; margin-left: 16rpx; }
    .btn-buy { flex: 1; background: #07c160; color: #fff; border: none; border-radius: 40rpx; padding: 20rpx; font-size: 28rpx; margin-left: 12rpx; }
}
</style>
