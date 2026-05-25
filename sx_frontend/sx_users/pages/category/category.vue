<template>
<view class="page flex">
    <!-- 左侧一级分类 -->
    <scroll-view class="left-menu" scroll-y>
        <view v-for="item in categories" :key="item.id"
              :class="['menu-item', currentId === item.id ? 'active' : '']"
              @click="switchCategory(item)">
            <text>{{ item.name }}</text>
        </view>
    </scroll-view>

    <!-- 右侧商品列表 -->
    <scroll-view class="right-content" scroll-y @scrolltolower="loadMore">
        <!-- 子分类 -->
        <view class="sub-cates" v-if="subCategories.length">
            <view v-for="sub in subCategories" :key="sub.id"
                  :class="['sub-item', currentId === sub.id ? 'active' : '']"
                  @click="switchCategory(sub)">
                <text>{{ sub.name }}</text>
            </view>
        </view>
        <!-- 商品 -->
        <view class="product-list">
            <view class="product-card" v-for="item in products" :key="item.id"
                  @click="goDetail(item.id)">
                <image :src="item.coverImage || defaultImg" mode="aspectFill" class="product-img"></image>
                <view class="product-info">
                    <text class="product-name text-ellipsis-2">{{ item.name }}</text>
                    <view class="product-bottom">
                        <view class="price">
                            <text class="price-symbol">¥</text>
                            <text class="price-value">{{ item.price }}</text>
                        </view>
                        <text class="add-btn" @click.stop="addCart(item)">+</text>
                    </view>
                </view>
            </view>
        </view>
        <view v-if="products.length === 0" class="empty-tip">暂无商品</view>
        <view class="load-more-wrap" v-if="loading"><text>加载中...</text></view>
        <view class="load-more-wrap" v-if="noMore"><text>— 没有更多了 —</text></view>
    </scroll-view>
</view>
</template>

<script>
import productApi from '@/api/product.js'
import { useCartStore } from '@/stores/cart.js'

export default {
    data() {
        return {
            categories: [],
            subCategories: [],
            currentId: 0,
            products: [],
            page: 1,
            loading: false,
            noMore: false,
            defaultImg: '/static/images/default-product.png'
        }
    },
    onLoad() {
        this.loadCategories()
    },
    methods: {
        async loadCategories() {
            const res = await productApi.getCategoryList()
            if (res.code === 200) {
                this.categories = (res.data || []).filter(c => !c.parentId || c.parentId === 0)
                if (this.categories.length > 0) this.switchCategory(this.categories[0])
            }
        },
        async switchCategory(item) {
            this.currentId = item.id
            this.page = 1; this.noMore = false; this.products = []
            // 获取子分类
            const res = await productApi.getCategoryList()
            if (res.code === 200) {
                this.subCategories = (res.data || []).filter(c => c.parentId === item.id)
            }
            this.loadProducts()
        },
        async loadProducts() {
            if (this.loading || this.noMore) return
            this.loading = true
            try {
                const res = await productApi.getProductList({
                    categoryId: this.currentId, page: this.page, pageSize: 20
                })
                if (res.code === 200) {
                    const data = res.data
                    this.products = this.page === 1 ? data.records : [...this.products, ...data.records]
                    this.noMore = data.records.length < 20
                }
            } finally {
                this.loading = false
            }
        },
        loadMore() { this.page++; this.loadProducts() },
        goDetail(id) { uni.navigateTo({ url: '/pages/product/detail?id=' + id }) },
        addCart(item) {
            const cartStore = useCartStore()
            cartStore.addToCart({ productId: item.id, quantity: 1 }).then(() => {
                uni.showToast({ title: '已加入购物车', icon: 'success' })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.page { height: 100vh; }
.left-menu {
    width: 200rpx; background: #f5f5f5;
    .menu-item { padding: 30rpx 20rpx; font-size: 26rpx; color: #666; text-align: center; }
    .menu-item.active { background: #fff; color: #07c160; font-weight: bold; border-left: 6rpx solid #07c160; }
}
.right-content { flex: 1; background: #fff; padding: 16rpx; }
.sub-cates { display: flex; flex-wrap: wrap; margin-bottom: 16rpx;
    .sub-item { padding: 10rpx 20rpx; margin: 6rpx; background: #f5f5f5; border-radius: 20rpx; font-size: 22rpx; color: #666; }
    .sub-item.active { background: #e8f8ee; color: #07c160; }
}
.product-list { display: flex; flex-wrap: wrap; justify-content: space-between; }
.product-card {
    width: 48%; background: #fff; border-radius: 12rpx; margin-bottom: 16rpx; overflow: hidden;
    .product-img { width: 100%; height: 240rpx; }
    .product-info { padding: 12rpx; }
    .product-name { font-size: 24rpx; height: 64rpx; line-height: 1.3; }
    .product-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 8rpx; }
    .price { color: #ee0a24; }
    .price-symbol { font-size: 20rpx; font-weight: bold; }
    .price-value { font-size: 28rpx; font-weight: bold; }
    .add-btn {
        width: 40rpx; height: 40rpx; background: #07c160; color: #fff;
        border-radius: 50%; text-align: center; line-height: 40rpx; font-size: 32rpx;
    }
}
.empty-tip { text-align: center; color: #999; padding: 100rpx 0; }
.load-more-wrap { display: flex; justify-content: center; align-items: center; padding: 20rpx 0; }
.load-more-wrap text { color: #ccc; font-size: 24rpx; }
</style>
