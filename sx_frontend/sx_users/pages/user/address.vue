<template>
<view class="page">
    <view class="address-item" v-for="addr in addressList" :key="addr.id">
        <view class="addr-info" @click="selectAddress(addr)">
            <view class="addr-top">
                <text class="addr-name">{{ addr.receiverName }}</text>
                <text class="addr-phone">{{ addr.receiverPhone }}</text>
                <text class="addr-tag" v-if="addr.isDefault">默认</text>
            </view>
            <text class="addr-detail">{{ addr.province }}{{ addr.city }}{{ addr.district }} {{ addr.detailAddress }}</text>
        </view>
        <view class="addr-actions">
            <text class="action-btn" @click="editAddress(addr)">编辑</text>
            <text class="action-btn delete" @click="deleteAddress(addr.id)">删除</text>
        </view>
    </view>

    <view v-if="addressList.length === 0" class="empty-tip">
        <image :src="ICON.location" class="empty-icon-img" mode="aspectFit"></image>
        <text>暂无收货地址</text>
    </view>

    <view style="height: 120rpx;"></view>

    <view class="bottom-btn safe-area-bottom">
        <button class="btn-primary" @click="editAddress()">新增收货地址</button>
    </view>
</view>
</template>

<script>
import addressApi from '@/api/address.js'
import { ICON } from '@/common/icons.js'

export default {
    setup() { return { ICON } },
    data() {
        return { addressList: [], selectMode: false }
    },
    onLoad(options) {
        if (options.mode === 'select') this.selectMode = true
    },
    onShow() { this.loadAddresses() },
    methods: {
        async loadAddresses() {
            const res = await addressApi.getAddressList()
            if (res.code === 200) this.addressList = res.data || []
        },
        selectAddress(addr) {
            if (!this.selectMode) return
            // 将选中地址数据传回上一页
            const pages = getCurrentPages()
            const prevPage = pages[pages.length - 2]
            if (prevPage) {
                prevPage.$vm.selectedAddress = addr
            }
            uni.navigateBack()
        },
        editAddress(addr) {
            const params = addr ? '?id=' + addr.id : ''
            uni.navigateTo({ url: '/pages/user/address-edit' + params })
        },
        async deleteAddress(id) {
            uni.showModal({
                title: '提示', content: '确定删除该地址？',
                success: async (res) => {
                    if (res.confirm) {
                        await addressApi.deleteAddress(id)
                        this.loadAddresses()
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.page { background: #f5f5f5; min-height: 100vh; padding: 20rpx; }
.address-item { background: #fff; border-radius: 16rpx; padding: 24rpx; margin-bottom: 16rpx; }
.addr-top { display: flex; align-items: center; gap: 12rpx; margin-bottom: 8rpx; }
.addr-name { font-size: 30rpx; font-weight: bold; }
.addr-phone { font-size: 26rpx; color: #666; }
.addr-tag { font-size: 20rpx; color: #07c160; background: #e8f8ee; padding: 4rpx 10rpx; border-radius: 4rpx; }
.addr-detail { font-size: 24rpx; color: #999; }
.addr-actions { display: flex; justify-content: flex-end; gap: 20rpx; margin-top: 16rpx; padding-top: 16rpx; border-top: 1rpx solid #f5f5f5; }
.action-btn { font-size: 24rpx; color: #07c160; padding: 6rpx 16rpx; }
.action-btn.delete { color: #ee0a24; }
.empty-tip { display: flex; flex-direction: column; align-items: center; padding: 200rpx 0; color: #999; .empty-icon-img { width: 100rpx; height: 100rpx; margin-bottom: 20rpx; } }
.bottom-btn { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; padding: 20rpx 40rpx; }
.bottom-btn .btn-primary { width: 100%; padding: 22rpx; border-radius: 40rpx; font-size: 30rpx; }
</style>
