import http from './request'

export default {
  // 分类列表
  getCategoryList() {
    return http.get('/api/v1/category/list')
  },
  // 新增分类
  addCategory(data) {
    return http.post('/admin/v1/category', data)
  },
  // 修改分类
  updateCategory(id, data) {
    return http.put('/admin/v1/category/' + id, data)
  },
  // 删除分类
  deleteCategory(id) {
    return http.delete('/admin/v1/category/' + id)
  },
  // 商品列表
  getProductList(params) {
    return http.get('/admin/v1/product/list', { params })
  },
  // 商品详情
  getProductDetail(id) {
    return http.get('/api/v1/product/' + id)
  },
  // 新增商品
  addProduct(data) {
    return http.post('/admin/v1/product', data)
  },
  // 编辑商品
  updateProduct(id, data) {
    return http.put('/admin/v1/product/' + id, data)
  },
  // 上下架
  toggleProductStatus(id, status) {
    return http.put('/admin/v1/product/' + id + '/status', null, { params: { status } })
  },
  // 删除商品
  deleteProduct(id) {
    return http.delete('/admin/v1/product/' + id)
  },
  // SKU 列表
  getSkuList(productId) {
    return http.get('/admin/v1/product/' + productId + '/sku')
  },
  // 新增 SKU
  addSku(productId, data) {
    return http.post('/admin/v1/product/' + productId + '/sku', data)
  },
  // 修改 SKU
  updateSku(id, data) {
    return http.put('/admin/v1/product/sku/' + id, data)
  },
  // 删除 SKU
  deleteSku(id) {
    return http.delete('/admin/v1/product/sku/' + id)
  }
}
