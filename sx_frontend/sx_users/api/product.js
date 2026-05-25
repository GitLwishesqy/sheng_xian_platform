import http from './request.js'

export default {
    // 分类列表
    getCategoryList(silent = false) {
        return http.get('/api/v1/category/list', {}, silent)
    },
    // 商品列表
    getProductList(params) {
        return http.get('/api/v1/product/list', params)
    },
    // 商品搜索
    searchProduct(keyword, params = {}) {
        return http.get('/api/v1/product/search', { keyword, ...params })
    },
    // 商品详情
    getProductDetail(id) {
        return http.get('/api/v1/product/' + id)
    },
    // 商品评价
    getProductReviews(id, params) {
        return http.get('/api/v1/product/' + id + '/reviews', params)
    }
}
