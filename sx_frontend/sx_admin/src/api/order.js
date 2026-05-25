import http from './request'

export default {
  // 订单列表
  getOrderList(params) {
    return http.get('/admin/v1/order/list', { params })
  },
  // 订单详情
  getOrderDetail(id) {
    return http.get('/api/v1/order/' + id)
  },
  // 发货
  deliveryOrder(id) {
    return http.put('/admin/v1/order/' + id + '/delivery')
  },
  // 取消订单
  cancelOrder(id) {
    return http.put('/admin/v1/order/' + id + '/cancel')
  },
  // 退款列表
  getRefundList(params) {
    return http.get('/admin/v1/order/refund/list', { params })
  },
  // 处理退款
  handleRefund(id, data) {
    return http.put('/admin/v1/order/refund/' + id + '/handle', data)
  }
}
