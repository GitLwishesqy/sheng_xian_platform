import http from './request.js'

export default {
    // 创建订单
    createOrder(data) {
        return http.post('/api/v1/order', data)
    },
    // 订单列表
    getOrderList(params) {
        return http.get('/api/v1/order/list', params)
    },
    // 订单详情
    getOrderDetail(id) {
        return http.get('/api/v1/order/' + id)
    },
    // 发起支付
    payOrder(id) {
        return http.post('/api/v1/order/' + id + '/pay')
    },
    // 取消订单
    cancelOrder(id) {
        return http.put('/api/v1/order/' + id + '/cancel')
    },
    // 确认收货
    confirmReceive(id) {
        return http.put('/api/v1/order/' + id + '/confirm')
    },
    // 申请退款
    refundOrder(id, data) {
        return http.post('/api/v1/order/' + id + '/refund', data)
    },
    // 金额预计算
    checkAmount(data) {
        return http.get('/api/v1/order/amount-check', data)
    }
}
