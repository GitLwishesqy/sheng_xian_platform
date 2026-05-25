import http from './request.js'

export default {
    // 可领取的优惠券
    getAvailableCoupons() {
        return http.get('/api/v1/coupon/available')
    },
    // 领取优惠券
    receiveCoupon(id) {
        return http.post('/api/v1/coupon/' + id + '/receive')
    },
    // 我的优惠券
    getMyCoupons(status) {
        return http.get('/api/v1/coupon/my', { status })
    },
    // 当前订单可用优惠券
    getOrderCoupons(orderAmount) {
        return http.get('/api/v1/coupon/order-available', { orderAmount })
    }
}
