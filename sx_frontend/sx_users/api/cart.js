import http from './request.js'

export default {
    // 购物车列表
    getCartList() {
        return http.get('/api/v1/cart/list')
    },
    // 加入购物车
    addToCart(data) {
        return http.post('/api/v1/cart', data)
    },
    // 修改数量
    updateQuantity(id, quantity) {
        return http.put('/api/v1/cart/' + id, { quantity })
    },
    // 选中/取消
    toggleSelect(id, selected) {
        return http.put('/api/v1/cart/' + id + '/select', { selected })
    },
    // 全选/取消
    selectAll(selected) {
        return http.put('/api/v1/cart/select-all', { selected })
    },
    // 删除
    removeItem(id) {
        return http.del('/api/v1/cart/' + id)
    },
    // 清空购物车
    clearCart() {
        return http.del('/api/v1/cart/clear')
    }
}
