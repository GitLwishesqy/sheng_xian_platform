// API 请求封装
import { BASE_URL } from './env.js'

let isRefreshing = false
let pendingRequests = []

function request(options) {
    return new Promise((resolve, reject) => {
        const token = uni.getStorageSync('token')
        const header = {
            'Content-Type': 'application/json'
        }
        if (token) {
            header['Authorization'] = 'Bearer ' + token
        }
        const silent = options.silent || false

        uni.request({
            url: BASE_URL + options.url,
            method: options.method || 'GET',
            data: options.data || {},
            header: header,
            timeout: 30000,
            success: (res) => {
                const { statusCode, data } = res
                if (statusCode === 401 || statusCode === 403) {
                    uni.removeStorageSync('token')
                    uni.removeStorageSync('userInfo')
                    if (!silent) {
                        uni.showToast({ title: '请先登录', icon: 'none' })
                    }
                    setTimeout(() => {
                        uni.navigateTo({ url: '/pages/user/login' })
                    }, 1000)
                    reject(data)
                    return
                }
                if (statusCode === 200) {
                    if (data.code === 200) {
                        resolve(data)
                    } else if (data.code === 401) {
                        uni.removeStorageSync('token')
                        uni.removeStorageSync('userInfo')
                        if (!silent) {
                            uni.showToast({ title: '登录已过期，请重新登录', icon: 'none' })
                        }
                        setTimeout(() => {
                            uni.navigateTo({ url: '/pages/user/login' })
                        }, 1500)
                        reject(data)
                    } else {
                        if (!silent) {
                            uni.showToast({ title: data.message || '请求失败', icon: 'none' })
                        }
                        reject(data)
                    }
                } else {
                    if (!silent) {
                        uni.showToast({ title: '服务器繁忙，请稍后再试', icon: 'none' })
                    }
                    reject(data)
                }
            },
            fail: (err) => {
                if (!silent) {
                    uni.showToast({ title: '网络连接失败', icon: 'none' })
                }
                reject(err)
            }
        })
    })
}

function get(url, data = {}, silent = false) {
    return request({ url, method: 'GET', data, silent })
}

function post(url, data = {}, silent = false) {
    return request({ url, method: 'POST', data, silent })
}

function put(url, data = {}, silent = false) {
    return request({ url, method: 'PUT', data, silent })
}

function del(url, data = {}, silent = false) {
    return request({ url, method: 'DELETE', data, silent })
}

export default { get, post, put, del, BASE_URL }
