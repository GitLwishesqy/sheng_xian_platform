<template>
<view class="page">
    <view class="form">
        <view class="form-item">
            <text class="label">收货人</text>
            <input class="input" v-model="form.receiverName" placeholder="请输入收货人姓名" />
        </view>
        <view class="form-item">
            <text class="label">手机号</text>
            <input class="input" v-model="form.receiverPhone" type="number" maxlength="11" placeholder="请输入手机号" />
        </view>
        <view class="form-item">
            <text class="label">所在地区</text>
            <input class="input" v-model="regionText" placeholder="请选择省市区" @click="showRegionPicker = true" disabled />
        </view>
        <view class="form-item">
            <text class="label">详细地址</text>
            <input class="input" v-model="form.detailAddress" placeholder="街道、门牌号等" />
        </view>
        <view class="form-item">
            <text class="label">设为默认</text>
            <switch :checked="form.isDefault === 1" @change="form.isDefault = form.isDefault === 1 ? 0 : 1" color="#07c160" />
        </view>
    </view>

    <view class="bottom-btn safe-area-bottom">
        <button class="btn-primary" @click="saveAddress">保存地址</button>
    </view>

    <!-- 地区选择器 -->
    <picker mode="region" :value="region" @change="onRegionChange" v-if="showRegionPicker">
        <!-- picker visible via click -->
    </picker>
</view>
</template>

<script>
import addressApi from '@/api/address.js'

export default {
    data() {
        return {
            id: '',
            form: {
                receiverName: '',
                receiverPhone: '',
                province: '',
                city: '',
                district: '',
                detailAddress: '',
                isDefault: 0
            },
            region: [],
            regionText: '',
            showRegionPicker: false
        }
    },
    onLoad(options) {
        if (options.id) {
            this.id = options.id
            this.loadAddress()
        }
    },
    methods: {
        async loadAddress() {
            const res = await addressApi.getAddressList()
            if (res.code === 200) {
                const addr = (res.data || []).find(a => a.id == this.id)
                if (addr) {
                    this.form = { ...addr }
                    this.region = [addr.province, addr.city, addr.district]
                    this.regionText = addr.province + ' ' + addr.city + ' ' + addr.district
                }
            }
        },
        onRegionChange(e) {
            const [province, city, district] = e.detail.value
            this.form.province = province
            this.form.city = city
            this.form.district = district
            this.regionText = province + ' ' + city + ' ' + district
            this.region = e.detail.value
        },
        async saveAddress() {
            if (!this.form.receiverName) { uni.showToast({ title: '请输入收货人', icon: 'none' }); return }
            if (!this.form.receiverPhone) { uni.showToast({ title: '请输入手机号', icon: 'none' }); return }
            if (!this.form.detailAddress) { uni.showToast({ title: '请输入详细地址', icon: 'none' }); return }

            if (this.id) {
                await addressApi.updateAddress(this.id, this.form)
            } else {
                await addressApi.addAddress(this.form)
            }
            uni.showToast({ title: '保存成功', icon: 'success' })
            setTimeout(() => uni.navigateBack(), 1000)
        }
    }
}
</script>

<style lang="scss" scoped>
.page { background: #f5f5f5; min-height: 100vh; padding: 20rpx; }
.form { background: #fff; border-radius: 16rpx; padding: 0 24rpx; }
.form-item { display: flex; align-items: center; padding: 24rpx 0; border-bottom: 1rpx solid #f5f5f5; }
.label { width: 160rpx; font-size: 28rpx; color: #333; }
.input { flex: 1; font-size: 28rpx; }
.bottom-btn { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; padding: 20rpx 40rpx; }
.bottom-btn .btn-primary { width: 100%; padding: 22rpx; border-radius: 40rpx; font-size: 30rpx; }
</style>
