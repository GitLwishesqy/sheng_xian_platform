"use strict";
const api_request = require("./request.js");
const cartApi = {
  // 购物车列表
  getCartList() {
    return api_request.http.get("/api/v1/cart/list");
  },
  // 加入购物车
  addToCart(data) {
    return api_request.http.post("/api/v1/cart", data);
  },
  // 修改数量
  updateQuantity(id, quantity) {
    return api_request.http.put("/api/v1/cart/" + id, { quantity });
  },
  // 选中/取消
  toggleSelect(id, selected) {
    return api_request.http.put("/api/v1/cart/" + id + "/select", { selected });
  },
  // 全选/取消
  selectAll(selected) {
    return api_request.http.put("/api/v1/cart/select-all", { selected });
  },
  // 删除
  removeItem(id) {
    return api_request.http.del("/api/v1/cart/" + id);
  },
  // 清空购物车
  clearCart() {
    return api_request.http.del("/api/v1/cart/clear");
  }
};
exports.cartApi = cartApi;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/cart.js.map
