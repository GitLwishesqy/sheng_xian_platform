import http from './request'

export default {
  // Banner 列表
  getBannerList() {
    return http.get('/api/v1/banner/list')
  },
  // 新增 Banner
  addBanner(data) {
    return http.post('/admin/v1/banner', data)
  },
  // 编辑 Banner
  updateBanner(id, data) {
    return http.put('/admin/v1/banner/' + id, data)
  },
  // 删除 Banner
  deleteBanner(id) {
    return http.delete('/admin/v1/banner/' + id)
  },
  // 优惠券列表
  getCouponList() {
    return http.get('/admin/v1/coupon/list')
  },
  // 创建优惠券
  addCoupon(data) {
    return http.post('/admin/v1/coupon', data)
  },
  // 编辑优惠券
  updateCoupon(id, data) {
    return http.put('/admin/v1/coupon/' + id, data)
  },
  // 启用/停用优惠券
  toggleCouponStatus(id, status) {
    return http.put('/admin/v1/coupon/' + id + '/status', null, { params: { status } })
  }
}
