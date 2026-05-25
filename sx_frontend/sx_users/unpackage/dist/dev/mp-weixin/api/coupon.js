"use strict";
const api_request = require("./request.js");
const couponApi = {
  // 可领取的优惠券
  getAvailableCoupons() {
    return api_request.http.get("/api/v1/coupon/available");
  },
  // 领取优惠券
  receiveCoupon(id) {
    return api_request.http.post("/api/v1/coupon/" + id + "/receive");
  },
  // 我的优惠券
  getMyCoupons(status) {
    return api_request.http.get("/api/v1/coupon/my", { status });
  },
  // 当前订单可用优惠券
  getOrderCoupons(orderAmount) {
    return api_request.http.get("/api/v1/coupon/order-available", { orderAmount });
  }
};
exports.couponApi = couponApi;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/coupon.js.map
