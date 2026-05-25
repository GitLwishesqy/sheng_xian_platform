<template>
<view class="page">
    <view class="logo-area">
        <image src="/static/images/icon-logo.png" class="logo-img" mode="aspectFit"></image>
        <text class="app-name">生鲜平台</text>
        <text class="slogan">新鲜每一天</text>
    </view>

    <view class="login-form" v-if="!isMpWeixin">
        <view class="input-group">
            <input class="input" v-model="phone" type="number" maxlength="11" placeholder="请输入手机号" />
        </view>
        <view class="input-group">
            <input class="input" v-model="code" type="number" maxlength="6" placeholder="请输入验证码" />
            <button class="code-btn" @click="sendCode" :disabled="codeCountdown > 0">
                {{ codeCountdown > 0 ? codeCountdown + 's' : '获取验证码' }}
            </button>
        </view>
        <button class="login-btn" @click="handleLogin">登录</button>
    </view>

    <view class="login-form" v-else>
        <button class="wechat-btn" @click="handleWechatLogin">
            <image src="/static/images/icon-wechat.png" class="wechat-icon" mode="aspectFit"></image>
            <text>微信一键登录</text>
        </button>
    </view>
</view>
</template>

<script>
import { useUserStore } from '@/stores/user.js'
import userApi from '@/api/user.js'

export default {
    data() {
        return {
            phone: '',
            code: '',
            codeCountdown: 0,
            isMpWeixin: false
        }
    },
    onLoad() {
        // #ifdef MP-WEIXIN
        this.isMpWeixin = true
        // #endif
    },
    methods: {
        async sendCode() {
            if (!this.phone || this.phone.length !== 11) {
                uni.showToast({ title: '请输入正确手机号', icon: 'none' }); return
            }
            try {
                const res = await userApi.sendSms(this.phone)
                if (res.code === 200) {
                    uni.showToast({ title: '验证码已发送', icon: 'success' })
                    // 开发环境展示验证码，生产环境去掉此log
                    if (res.data && res.data.code) {
                        console.log('【开发模式】验证码:', res.data.code)
                    }
                    this.codeCountdown = 60
                    const timer = setInterval(() => {
                        this.codeCountdown--
                        if (this.codeCountdown <= 0) clearInterval(timer)
                    }, 1000)
                } else {
                    uni.showToast({ title: res.message || '发送失败', icon: 'none' })
                }
            } catch (e) {
                uni.showToast({ title: '发送失败，请稍后重试', icon: 'none' })
            }
        },
        async handleLogin() {
            if (!this.phone) { uni.showToast({ title: '请输入手机号', icon: 'none' }); return }
            if (!this.code) { uni.showToast({ title: '请输入验证码', icon: 'none' }); return }
            try {
                await useUserStore().loginByPhone(this.phone, this.code)
                uni.showToast({ title: '登录成功', icon: 'success' })
                setTimeout(() => uni.navigateBack(), 1000)
            } catch (e) {
                uni.showToast({ title: e.message || '登录失败', icon: 'none' })
            }
        },
        async handleWechatLogin() {
            // #ifdef MP-WEIXIN
            try {
                await useUserStore().loginByWechat()
                uni.showToast({ title: '登录成功', icon: 'success' })
                setTimeout(() => uni.navigateBack(), 1000)
            } catch (e) {
                uni.showToast({ title: '登录失败，请重试', icon: 'none' })
            }
            // #endif
            // #ifndef MP-WEIXIN
            uni.showToast({ title: '请在微信小程序中使用', icon: 'none' })
            // #endif
        }
    }
}
</script>

<style lang="scss" scoped>
.page { display: flex; flex-direction: column; align-items: center; padding-top: 120rpx; min-height: 100vh; background: #fff; }
.logo-area { text-align: center; margin-bottom: 80rpx; }
.logo-img { width: 120rpx; height: 120rpx; }
.logo { font-size: 100rpx; }
.app-name { font-size: 40rpx; font-weight: bold; color: #07c160; display: block; margin-top: 16rpx; }
.slogan { font-size: 24rpx; color: #999; display: block; margin-top: 10rpx; }
.login-form { width: 80%; }
.input-group { display: flex; align-items: center; border-bottom: 2rpx solid #eee; margin-bottom: 30rpx; padding: 10rpx 0; }
.input { flex: 1; font-size: 30rpx; padding: 16rpx 0; }
.code-btn { width: 180rpx; font-size: 24rpx; color: #07c160; background: none; border: none; padding: 10rpx; white-space: nowrap; }
.code-btn[disabled] { color: #999; }
.login-btn { width: 100%; background: #07c160; color: #fff; border: none; border-radius: 40rpx; padding: 24rpx; font-size: 32rpx; margin-top: 40rpx; }
.wechat-btn { width: 100%; display: flex; align-items: center; justify-content: center; background: #07c160; color: #fff; border: none; border-radius: 40rpx; padding: 24rpx; font-size: 32rpx; }
.wechat-icon { width: 36rpx; height: 36rpx; margin-right: 12rpx; }
</style>
