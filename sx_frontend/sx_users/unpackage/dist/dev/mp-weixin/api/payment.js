"use strict";
const api_request = require("./request.js");
const paymentApi = {
  // 发起支付
  pay(orderId, method) {
    return api_request.http.post("/api/v1/payment/pay/" + orderId + "?method=" + (method || 1));
  },
  // 查询支付状态
  query(orderId) {
    return api_request.http.get("/api/v1/payment/" + orderId);
  },
  // 支付回调通知
  notify(paymentNo, transactionId) {
    return api_request.http.post("/api/v1/payment/notify/" + paymentNo, { transactionId });
  }
};
exports.paymentApi = paymentApi;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/payment.js.map
