import http from './request'

export default {
  // 登录
  login(username, password) {
    const params = new URLSearchParams()
    params.append('username', username)
    params.append('password', password)
    return http.post('/admin/v1/sys/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
  },
  // 管理员列表
  getAdminList(params) {
    return http.get('/admin/v1/sys/user/list', { params })
  },
  // 新增管理员
  addAdmin(data) {
    return http.post('/admin/v1/sys/user', data)
  },
  // 编辑管理员
  updateAdmin(id, data) {
    return http.put('/admin/v1/sys/user/' + id, data)
  },
  // 角色列表
  getRoleList() {
    return http.get('/admin/v1/sys/role/list')
  },
  // 新增角色
  addRole(data) {
    return http.post('/admin/v1/sys/role', data)
  },
  // 编辑角色
  updateRole(id, data) {
    return http.put('/admin/v1/sys/role/' + id, data)
  },
  // 分配角色权限
  assignRoleMenu(roleId, menuIds) {
    return http.put('/admin/v1/sys/role/' + roleId + '/menu', { menuIds })
  },
  // 菜单树
  getMenuTree() {
    return http.get('/admin/v1/sys/menu/tree')
  }
}
