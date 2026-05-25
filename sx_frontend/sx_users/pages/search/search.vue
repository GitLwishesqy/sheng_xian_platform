<template>
<view class="page">
    <!-- 搜索栏 -->
    <view class="search-bar">
        <view class="search-box">
            <text class="search-icon"></text>
            <input class="search-input" v-model="keyword" placeholder="搜索商品" confirm-type="search"
                   @confirm="doSearch" focus />
            <text class="clear-btn" v-if="keyword" @click="keyword = ''">✕</text>
        </view>
        <text class="cancel-btn" @click="goBack">取消</text>
    </view>

    <!-- 搜索历史 -->
    <view class="history" v-if="!searched && history.length > 0">
        <view class="history-header flex-between">
            <text class="history-title">搜索历史</text>
            <text class="clear-history" @click="history = []">清除</text>
        </view>
        <view class="history-tags">
            <text class="tag" v-for="(kw, idx) in history" :key="idx" @click="searchHistory(kw)">{{ kw }}</text>
        </view>
    </view>

    <!-- 搜索结果 -->
    <scroll-view class="result-list" scroll-y v-if="searched">
        <view class="product-item" v-for="item in products" :key="item.id" @click="goDetail(item.id)">
            <image :src="item.coverImage || defaultImg" mode="aspectFill" class="item-img"></image>
            <view class="item-info">
                <text class="item-name text-ellipsis-2">{{ item.name }}</text>
                <view class="item-bottom">
                    <view class="price">
                        <text class="price-symbol">¥</text>
                        <text class="price-value">{{ item.price }}</text>
                    </view>
                    <text class="sales">已售{{ item.sales || 0 }}</text>
                </view>
            </view>
        </view>
        <text class="load-more" v-if="loading">搜索中...</text>
        <text class="empty-tip" v-if="!loading && products.length === 0">未找到相关商品</text>
    </scroll-view>
</view>
</template>

<script>
import productApi from '@/api/product.js'

export default {
    data() {
        return {
            keyword: '',
            searched: false,
            products: [],
            history: [],
            loading: false,
            defaultImg: '/static/images/default-product.png'
        }
    },
    onLoad() {
        const h = uni.getStorageSync('searchHistory')
        if (h) this.history = JSON.parse(h)
    },
    methods: {
        doSearch() {
            if (!this.keyword.trim()) return
            this.searched = true; this.loading = true; this.products = []
            // 保存搜索历史
            if (!this.history.includes(this.keyword)) {
                this.history.unshift(this.keyword)
                if (this.history.length > 10) this.history.pop()
                uni.setStorageSync('searchHistory', JSON.stringify(this.history))
            }
            productApi.searchProduct(this.keyword).then(res => {
                if (res.code === 200) this.products = res.data.records || []
            }).finally(() => { this.loading = false })
        },
        searchHistory(kw) {
            this.keyword = kw
            this.doSearch()
        },
        goDetail(id) { uni.navigateTo({ url: '/pages/product/detail?id=' + id }) },
        goBack() { uni.navigateBack() }
    }
}
</script>

<style lang="scss" scoped>
.page { background: #fff; min-height: 100vh; }
.search-bar { display: flex; align-items: center; padding: 16rpx 20rpx; background: #f5f5f5; }
.search-box { flex: 1; display: flex; align-items: center; background: #fff; border-radius: 40rpx; padding: 12rpx 20rpx; }
.search-icon { font-size: 28rpx; margin-right: 10rpx; }
.search-input { flex: 1; font-size: 28rpx; }
.clear-btn { font-size: 28rpx; color: #ccc; padding: 0 10rpx; }
.cancel-btn { font-size: 28rpx; color: #333; margin-left: 16rpx; white-space: nowrap; }
.history { padding: 20rpx; }
.history-header { margin-bottom: 16rpx; }
.history-title { font-size: 28rpx; font-weight: bold; }
.clear-history { font-size: 24rpx; color: #999; }
.history-tags { display: flex; flex-wrap: wrap; gap: 16rpx; }
.tag { padding: 10rpx 20rpx; background: #f5f5f5; border-radius: 20rpx; font-size: 24rpx; color: #666; }
.result-list { padding: 16rpx; }
.product-item { display: flex; padding: 16rpx 0; border-bottom: 1rpx solid #f5f5f5; }
.item-img { width: 160rpx; height: 160rpx; border-radius: 12rpx; flex-shrink: 0; }
.item-info { flex: 1; margin-left: 20rpx; display: flex; flex-direction: column; justify-content: space-between; }
.item-name { font-size: 28rpx; color: #333; }
.item-bottom { display: flex; justify-content: space-between; align-items: center; }
.price { color: #ee0a24; }
.price-symbol { font-size: 22rpx; font-weight: bold; }
.price-value { font-size: 32rpx; font-weight: bold; }
.sales { font-size: 22rpx; color: #999; }
.load-more { text-align: center; color: #999; padding: 30rpx; font-size: 24rpx; }
.empty-tip { text-align: center; color: #999; padding: 120rpx 0; font-size: 28rpx; }
</style>
