import http from './request.js'

export default {
    // 首页轮播图
    getBanners() {
        return http.get('/api/v1/banner/list', {}, true)
    },
    // 首页推荐商品
    getRecommendProducts() {
        return http.get('/api/v1/home/recommend', {}, true)
    },
    // 自提点列表
    getPickupPoints() {
        return http.get('/api/v1/pickup-point/list')
    }
}
