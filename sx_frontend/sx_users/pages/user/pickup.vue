<template>
<view class="page">
    <view class="pickup-item" v-for="point in pickupList" :key="point.id" @click="selectPoint(point)">
        <view class="point-info">
            <view class="point-top">
                <image :src="ICON.pickup" class="point-icon" mode="aspectFit"></image>
                <text class="point-name">{{ point.name }}</text>
            </view>
            <text class="point-address">📍 {{ point.address }}</text>
            <view class="point-meta" v-if="point.phone || point.businessHours">
                <text class="point-phone" v-if="point.phone">📞 {{ point.phone }}</text>
                <text class="point-hours" v-if="point.businessHours">🕐 {{ point.businessHours }}</text>
            </view>
        </view>
        <text class="point-arrow">→</text>
    </view>

    <view v-if="pickupList.length === 0 && !loading" class="empty-tip">
        <image :src="ICON.pickup" class="empty-icon-img" mode="aspectFit"></image>
        <text>暂无可用自提点</text>
    </view>
</view>
</template>

<script>
import pickupApi from '@/api/pickup.js'
import { ICON } from '@/common/icons.js'

export default {
    setup() { return { ICON } },
    data() {
        return { pickupList: [], loading: false, selectMode: false }
    },
    onLoad(options) {
        if (options.mode === 'select') this.selectMode = true
    },
    onShow() { this.loadPickupPoints() },
    methods: {
        async loadPickupPoints() {
            this.loading = true
            try {
                const res = await pickupApi.getPickupList()
                if (res.code === 200) this.pickupList = res.data || []
            } catch (e) { console.error('加载自提点失败', e) }
            finally { this.loading = false }
        },
        selectPoint(point) {
            if (!this.selectMode) return
            // 将选中自提点数据传回上一页
            const pages = getCurrentPages()
            const prevPage = pages[pages.length - 2]
            if (prevPage) {
                prevPage.$vm.selectedPickupPoint = point
            }
            uni.navigateBack()
        }
    }
}
</script>

<style lang="scss" scoped>
.page { background: #f5f5f5; min-height: 100vh; padding: 20rpx; }
.pickup-item { background: #fff; border-radius: 16rpx; padding: 24rpx; margin-bottom: 16rpx; display: flex; align-items: center; }
.point-info { flex: 1; }
.point-top { display: flex; align-items: center; gap: 10rpx; margin-bottom: 8rpx; }
.point-icon { width: 36rpx; height: 36rpx; }
.point-name { font-size: 30rpx; font-weight: bold; color: #333; }
.point-address { font-size: 24rpx; color: #666; display: block; margin-top: 6rpx; }
.point-meta { display: flex; flex-wrap: wrap; gap: 16rpx; margin-top: 8rpx; }
.point-phone { font-size: 22rpx; color: #999; }
.point-hours { font-size: 22rpx; color: #999; }
.point-arrow { font-size: 32rpx; color: #ccc; margin-left: 12rpx; }
.empty-tip { display: flex; flex-direction: column; align-items: center; padding: 200rpx 0; color: #999; .empty-icon-img { width: 100rpx; height: 100rpx; margin-bottom: 20rpx; } }
</style>
