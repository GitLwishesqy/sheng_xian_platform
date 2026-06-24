"use strict";
const api_request = require("./request.js");
const pickupApi = {
  // 自提点列表
  getPickupList() {
    return api_request.http.get("/api/v1/pickup-point/list");
  }
};
exports.pickupApi = pickupApi;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/pickup.js.map
