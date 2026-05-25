"use strict";
const api_request = require("./request.js");
const homeApi = {
  // 首页轮播图
  getBanners() {
    return api_request.http.get("/api/v1/banner/list", {}, true);
  },
  // 首页推荐商品
  getRecommendProducts() {
    return api_request.http.get("/api/v1/home/recommend", {}, true);
  },
  // 自提点列表
  getPickupPoints() {
    return api_request.http.get("/api/v1/pickup-point/list");
  }
};
exports.homeApi = homeApi;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/home.js.map
