import http from './request.js'

export default {
    // 自提点列表
    getPickupList() {
        return http.get('/api/v1/pickup-point/list')
    }
}
