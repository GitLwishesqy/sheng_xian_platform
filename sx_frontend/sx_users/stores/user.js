import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import userApi from '@/api/user.js'

export const useUserStore = defineStore('user', () => {
    const token = ref(uni.getStorageSync('token') || '')
    const userInfo = ref(null)
    const isLogin = computed(() => !!token.value)

    // 微信登录
    async function loginByWechat() {
        return new Promise((resolve, reject) => {
            uni.login({
                provider: 'weixin',
                success: async (loginRes) => {
                    try {
                        const res = await userApi.loginByWechat(loginRes.code)
                        if (res.code === 200) {
                            token.value = res.data.token
                            uni.setStorageSync('token', res.data.token)
                            await fetchUserInfo()
                            resolve(res)
                        } else {
                            reject(res)
                        }
                    } catch (e) {
                        reject(e)
                    }
                },
                fail: (err) => {
                    reject(err)
                }
            })
        })
    }

    // H5/APP 手机号登录
    async function loginByPhone(phone, code) {
        const res = await userApi.loginByPhone(phone, code)
        if (res.code === 200) {
            token.value = res.data.token
            uni.setStorageSync('token', res.data.token)
            await fetchUserInfo()
        }
        return res
    }

    // 获取用户信息
    async function fetchUserInfo() {
        try {
            const res = await userApi.getUserInfo()
            if (res.code === 200) {
                userInfo.value = res.data
                uni.setStorageSync('userInfo', JSON.stringify(res.data))
            }
        } catch (e) {
            console.error('获取用户信息失败', e)
        }
    }

    // 退出登录
    function logout() {
        token.value = ''
        userInfo.value = null
        uni.removeStorageSync('token')
        uni.removeStorageSync('userInfo')
    }

    return { token, userInfo, isLogin, loginByWechat, loginByPhone, fetchUserInfo, logout }
})
