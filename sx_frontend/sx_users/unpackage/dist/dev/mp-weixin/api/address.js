"use strict";
const api_request = require("./request.js");
const addressApi = {
  // 地址列表
  getAddressList() {
    return api_request.http.get("/api/v1/address/list");
  },
  // 新增地址
  addAddress(data) {
    return api_request.http.post("/api/v1/address", data);
  },
  // 修改地址
  updateAddress(id, data) {
    return api_request.http.put("/api/v1/address/" + id, data);
  },
  // 删除地址
  deleteAddress(id) {
    return api_request.http.del("/api/v1/address/" + id);
  },
  // 设为默认
  setDefault(id) {
    return api_request.http.put("/api/v1/address/" + id + "/default");
  }
};
exports.addressApi = addressApi;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/address.js.map
