"use strict";
const api_request = require("./request.js");
const orderApi = {
  // 创建订单
  createOrder(data) {
    return api_request.http.post("/api/v1/order", data);
  },
  // 订单列表
  getOrderList(params) {
    return api_request.http.get("/api/v1/order/list", params);
  },
  // 订单详情
  getOrderDetail(id) {
    return api_request.http.get("/api/v1/order/" + id);
  },
  // 发起支付
  payOrder(id) {
    return api_request.http.post("/api/v1/order/" + id + "/pay");
  },
  // 取消订单
  cancelOrder(id) {
    return api_request.http.put("/api/v1/order/" + id + "/cancel");
  },
  // 确认收货
  confirmReceive(id) {
    return api_request.http.put("/api/v1/order/" + id + "/confirm");
  },
  // 申请退款
  refundOrder(id, data) {
    return api_request.http.post("/api/v1/order/" + id + "/refund", data);
  },
  // 金额预计算
  checkAmount(data) {
    return api_request.http.get("/api/v1/order/amount-check", data);
  }
};
exports.orderApi = orderApi;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/order.js.map
