import http from './request'

export default {
  // 用户列表
  getUserList(params) {
    return http.get('/admin/v1/user/list', { params })
  },
  // 用户详情
  getUserDetail(id) {
    return http.get('/admin/v1/user/' + id)
  },
  // 启用/禁用用户
  toggleUserStatus(id, status) {
    return http.put('/admin/v1/user/' + id + '/status', null, { params: { status } })
  }
}
