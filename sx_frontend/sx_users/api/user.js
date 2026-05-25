import http from './request.js'

export default {
    // 微信登录
    loginByWechat(code) {
        return http.post('/api/v1/user/login/wechat', { code })
    },
    // 手机号登录
    loginByPhone(phone, code) {
        return http.post('/api/v1/user/login/phone', { phone, code })
    },
    // 获取用户信息
    getUserInfo() {
        return http.get('/api/v1/user/info')
    },
    // 修改用户信息
    updateUserInfo(data) {
        return http.put('/api/v1/user/info', data)
    },
    // 发送短信验证码
    sendSms(phone) {
        return http.post('/api/v1/user/login/sms/send', { phone })
    }
}
