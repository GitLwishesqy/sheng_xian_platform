<template>
<view class="page">
    <!-- 搜索栏 -->
    <view class="search-bar" @click="goSearch">
        <view class="search-box">
            <text class="search-icon"></text>
            <text class="search-placeholder">搜索新鲜水果、蔬菜...</text>
        </view>
    </view>

    <!-- 轮播图 -->
    <swiper v-if="banners.length" class="banner-swiper" indicator-dots autoplay circular interval="3000">
        <swiper-item v-for="item in banners" :key="item.id" @click="onBannerClick(item)">
            <image :src="item.image" mode="aspectFill" class="banner-image"></image>
        </swiper-item>
    </swiper>

    <!-- 分类入口（图标由前端common/categoryIcons.js统一管理，不依赖数据库） -->
    <view class="category-entry" v-if="categories.length">
        <view class="category-item" v-for="item in categories" :key="item.id"
              @click="goCategory(item)">
            <image v-if="!iconErrors[item.name]" :src="getIcon(item.name)"
                   class="category-icon" mode="aspectFit"
                   @error="onIconError(item.name)"></image>
            <text v-else class="category-icon-text">{{ getEmoji(item.name) }}</text>
            <text class="category-name">{{ item.name }}</text>
        </view>
    </view>

    <!-- 推荐商品 -->
    <view class="section">
        <view class="section-header">
            <text class="section-title">为你推荐</text>
            <text class="section-more" @click="goProductList">更多 →</text>
        </view>
        <view class="product-grid" v-if="products.length">
            <view class="product-card" v-for="item in products" :key="item.id"
                  @click="goDetail(item.id)">
                <image :src="item.coverImage || defaultImg" mode="aspectFill" class="product-img"></image>
                <view class="product-info">
                    <text class="product-name text-ellipsis-2">{{ item.name }}</text>
                    <view class="product-bottom">
                        <view class="price-box">
                            <text class="price-symbol">¥</text>
                            <text class="price-value">{{ item.price }}</text>
                        </view>
                        <text class="sales-text">已售{{ item.sales || 0 }}</text>
                    </view>
                </view>
            </view>
        </view>
        <view v-else class="empty-tip">
            <text>暂无商品数据</text>
        </view>
    </view>
</view>
</template>

<script>
import homeApi from '@/api/home.js'
import productApi from '@/api/product.js'
import { getCategoryIcon, getCategoryEmoji } from '@/common/categoryIcons.js'

export default {
    setup() { return { getCategoryIcon, getCategoryEmoji } },
    data() {
        return {
            banners: [],
            categories: [],
            products: [],
            defaultImg: '/static/images/default-product.png',
            iconErrors: {}  // 记录图片加载失败的分类
        }
    },
    onShow() {
        this.loadData()
    },
    onPullDownRefresh() {
        this.loadData().then(() => uni.stopPullDownRefresh())
    },
    methods: {
        async loadData() {
            try {
                const [bannerRes, cateRes, prodRes] = await Promise.all([
                    homeApi.getBanners(),
                    productApi.getCategoryList(true),
                    homeApi.getRecommendProducts()
                ])
                if (bannerRes.code === 200) this.banners = bannerRes.data || []
                if (cateRes.code === 200) this.categories = (cateRes.data || []).slice(0, 8)
                if (prodRes.code === 200) this.products = (prodRes.data && prodRes.data.records) || []
            } catch (e) {
                console.error('首页加载失败', e)
            }
        },
        getIcon(name) { return getCategoryIcon(name) },
        getEmoji(name) { return getCategoryEmoji(name) },
        onIconError(name) { this.iconErrors[name] = true },
        goSearch() { uni.navigateTo({ url: '/pages/search/search' }) },
        goDetail(id) { uni.navigateTo({ url: '/pages/product/detail?id=' + id }) },
        goProductList() { uni.navigateTo({ url: '/pages/product/list' }) },
        goCategory(item) { uni.navigateTo({ url: '/pages/product/list?categoryId=' + item.id + '&title=' + item.name }) },
        onBannerClick(item) {
            if (item.linkType === 1 && item.linkValue) {
                uni.navigateTo({ url: '/pages/product/detail?id=' + item.linkValue })
            } else if (item.linkType === 2 && item.linkValue) {
                uni.navigateTo({ url: '/pages/product/list?categoryId=' + item.linkValue })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.page { padding-bottom: 20rpx; }

.search-bar {
    padding: 16rpx 24rpx;
    background: #07c160;
    .search-box {
        display: flex; align-items: center;
        background: #fff; border-radius: 40rpx;
        padding: 14rpx 24rpx;
        .search-icon { margin-right: 12rpx; font-size: 28rpx; }
        .search-placeholder { color: #999; font-size: 26rpx; }
    }
}

.banner-swiper { width: 100%; height: 340rpx; margin: 0 0 16rpx;
    .banner-image { width: 100%; height: 100%; }
}

.category-entry {
    display: flex; flex-wrap: wrap;
    background: #fff; border-radius: 16rpx;
    margin: 0 20rpx 20rpx; padding: 20rpx 0;
    .category-item {
        width: 25%; display: flex; flex-direction: column;
        align-items: center; padding: 12rpx 0;
        .category-icon { width: 80rpx; height: 80rpx; border-radius: 50%; background: #f5f5f5; }
        .category-icon-text { font-size: 48rpx; }
        .category-name { font-size: 22rpx; color: #666; margin-top: 8rpx; }
    }
}

.section { margin: 0 20rpx 20rpx; }
.section-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 20rpx 0;
    .section-title { font-size: 32rpx; font-weight: bold; }
    .section-more { font-size: 24rpx; color: #999; }
}

.product-grid { display: flex; flex-wrap: wrap; justify-content: space-between; }
.product-card {
    width: 48.5%; background: #fff; border-radius: 16rpx;
    margin-bottom: 16rpx; overflow: hidden;
    .product-img { width: 100%; height: 340rpx; }
    .product-info { padding: 16rpx; }
    .product-name { font-size: 26rpx; color: #333; line-height: 1.4; height: 72rpx; }
    .product-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 12rpx; }
    .price-box { color: #ee0a24; }
    .price-symbol { font-size: 22rpx; font-weight: bold; }
    .price-value { font-size: 32rpx; font-weight: bold; }
    .sales-text { font-size: 20rpx; color: #999; }
}

.empty-tip {
    display: flex; justify-content: center; align-items: center;
    height: 200rpx; background: #fff; border-radius: 16rpx;
    color: #999; font-size: 26rpx;
}
</style>
