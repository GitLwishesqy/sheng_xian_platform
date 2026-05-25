"use strict";
const api_request = require("./request.js");
const productApi = {
  // 分类列表
  getCategoryList(silent = false) {
    return api_request.http.get("/api/v1/category/list", {}, silent);
  },
  // 商品列表
  getProductList(params) {
    return api_request.http.get("/api/v1/product/list", params);
  },
  // 商品搜索
  searchProduct(keyword, params = {}) {
    return api_request.http.get("/api/v1/product/search", { keyword, ...params });
  },
  // 商品详情
  getProductDetail(id) {
    return api_request.http.get("/api/v1/product/" + id);
  },
  // 商品评价
  getProductReviews(id, params) {
    return api_request.http.get("/api/v1/product/" + id + "/reviews", params);
  }
};
exports.productApi = productApi;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/product.js.map
