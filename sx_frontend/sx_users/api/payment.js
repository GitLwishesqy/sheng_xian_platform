import http from './request.js'

export default {
    // 发起支付
    pay(orderId, method) {
        return http.post('/api/v1/payment/pay/' + orderId + '?method=' + (method || 1))
    },
    // 查询支付状态
    query(orderId) {
        return http.get('/api/v1/payment/' + orderId)
    },
    // 支付回调通知
    notify(paymentNo, transactionId) {
        return http.post('/api/v1/payment/notify/' + paymentNo, { transactionId })
    }
}
