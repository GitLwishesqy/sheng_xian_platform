<template>
<view class="page">
    <!-- 排序栏 -->
    <view class="sort-bar">
        <view :class="['sort-item', sortType === 0 ? 'active' : '']" @click="setSort(0)">综合</view>
        <view :class="['sort-item', sortType === 1 ? 'active' : '']" @click="setSort(1)">销量</view>
        <view :class="['sort-item', sortType === 2 ? 'active' : '']" @click="setSort(2)">
            价格<text v-if="sortType===2">{{ sortAsc ? '↑' : '↓' }}</text>
        </view>
    </view>

    <!-- 商品列表 -->
    <scroll-view class="product-scroll" scroll-y @scrolltolower="loadMore" :style="{ height: scrollH + 'px' }">
        <view class="product-list">
            <view class="product-card" v-for="item in products" :key="item.id"
                  @click="goDetail(item.id)">
                <image :src="item.coverImage || defaultImg" mode="aspectFill" class="product-img"></image>
                <view class="product-info">
                    <text class="product-name text-ellipsis-2">{{ item.name }}</text>
                    <view class="tags" v-if="item.storageCondition">
                        <text class="tag">{{ item.storageCondition }}</text>
                    </view>
                    <view class="product-bottom">
                        <view class="price">
                            <text class="price-symbol">¥</text>
                            <text class="price-value">{{ item.price }}</text>
                            <text class="price-old" v-if="item.originalPrice">¥{{ item.originalPrice }}</text>
                        </view>
                        <text class="add-btn" @click.stop="addCart(item)">+</text>
                    </view>
                </view>
            </view>
        </view>
        <view class="load-more-wrap" v-if="loading"><text>加载中...</text></view>
        <view class="load-more-wrap" v-if="noMore"><text>— 没有更多了 —</text></view>
        <view class="safe-area-bottom" style="height: 40rpx;"></view>
    </scroll-view>
</view>
</template>

<script>
import productApi from '@/api/product.js'
import { useCartStore } from '@/stores/cart.js'

export default {
    data() {
        return {
            categoryId: '',
            keyword: '',
            sortType: 0,
            sortAsc: true,
            products: [],
            page: 1,
            loading: false,
            noMore: false,
            scrollH: 600,
            defaultImg: '/static/images/default-product.png'
        }
    },
    onLoad(options) {
        if (options.categoryId) this.categoryId = options.categoryId
        if (options.keyword) this.keyword = options.keyword
        if (options.title) uni.setNavigationBarTitle({ title: options.title })
        const sys = uni.getSystemInfoSync()
        this.scrollH = sys.windowHeight - 44
        this.loadProducts()
    },
    onPullDownRefresh() {
        this.page = 1; this.noMore = false; this.products = []
        this.loadProducts().then(() => uni.stopPullDownRefresh())
    },
    methods: {
        async loadProducts() {
            if (this.loading || this.noMore) return
            this.loading = true
            try {
                const params = { page: this.page, pageSize: 20 }
                if (this.categoryId) params.categoryId = this.categoryId
                if (this.keyword) params.keyword = this.keyword
                if (this.sortType === 1) params.sortField = 'sales'
                if (this.sortType === 2) { params.sortField = 'price'; params.sortOrder = this.sortAsc ? 'asc' : 'desc' }

                const res = this.keyword
                    ? await productApi.searchProduct(this.keyword, { page: this.page, pageSize: 20 })
                    : await productApi.getProductList(params)
                if (res.code === 200) {
                    const data = res.data
                    this.products = this.page === 1 ? data.records : [...this.products, ...data.records]
                    this.noMore = data.records.length < 20
                }
            } finally {
                this.loading = false
            }
        },
        setSort(type) {
            if (type === 2 && this.sortType === 2) { this.sortAsc = !this.sortAsc }
            else { this.sortType = type; this.sortAsc = true }
            this.page = 1; this.noMore = false; this.products = []
            this.loadProducts()
        },
        loadMore() { this.page++; this.loadProducts() },
        goDetail(id) { uni.navigateTo({ url: '/pages/product/detail?id=' + id }) },
        addCart(item) {
            useCartStore().addToCart({ productId: item.id, quantity: 1 }).then(() => {
                uni.showToast({ title: '已加入购物车', icon: 'success' })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.sort-bar { display: flex; background: #fff; padding: 16rpx 0; position: sticky; top: 0; z-index: 10;
    .sort-item { flex: 1; text-align: center; font-size: 26rpx; color: #666; }
    .sort-item.active { color: #07c160; font-weight: bold; }
}
.product-scroll { background: #f5f5f5; }
.product-list { display: flex; flex-wrap: wrap; justify-content: space-between; padding: 16rpx; }
.product-card {
    width: 48.5%; background: #fff; border-radius: 16rpx; margin-bottom: 16rpx; overflow: hidden;
    .product-img { width: 100%; height: 340rpx; }
    .product-info { padding: 16rpx; }
    .product-name { font-size: 26rpx; height: 72rpx; line-height: 1.4; }
    .tags { margin: 8rpx 0; .tag { font-size: 18rpx; color: #07c160; background: #e8f8ee; padding: 2rpx 8rpx; border-radius: 4rpx; } }
    .product-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 8rpx; }
    .price { color: #ee0a24; }
    .price-symbol { font-size: 22rpx; font-weight: bold; }
    .price-value { font-size: 32rpx; font-weight: bold; }
    .price-old { font-size: 20rpx; color: #999; text-decoration: line-through; margin-left: 6rpx; }
    .add-btn {
        width: 44rpx; height: 44rpx; background: #07c160; color: #fff;
        border-radius: 50%; text-align: center; line-height: 44rpx; font-size: 36rpx;
    }
}
.load-more-wrap { display: flex; justify-content: center; align-items: center; padding: 20rpx 0; }
.load-more-wrap text { color: #ccc; font-size: 24rpx; }
</style>
