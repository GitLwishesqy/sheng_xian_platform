import http from './request.js'

export default {
    // 地址列表
    getAddressList() {
        return http.get('/api/v1/address/list')
    },
    // 新增地址
    addAddress(data) {
        return http.post('/api/v1/address', data)
    },
    // 修改地址
    updateAddress(id, data) {
        return http.put('/api/v1/address/' + id, data)
    },
    // 删除地址
    deleteAddress(id) {
        return http.del('/api/v1/address/' + id)
    },
    // 设为默认
    setDefault(id) {
        return http.put('/api/v1/address/' + id + '/default')
    }
}
