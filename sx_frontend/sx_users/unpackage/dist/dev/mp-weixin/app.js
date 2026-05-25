"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/category/category.js";
  "./pages/cart/cart.js";
  "./pages/user/center.js";
  "./pages/product/list.js";
  "./pages/product/detail.js";
  "./pages/search/search.js";
  "./pages/order/confirm.js";
  "./pages/order/list.js";
  "./pages/order/detail.js";
  "./pages/user/login.js";
  "./pages/user/address.js";
  "./pages/user/address-edit.js";
  "./pages/order/payment.js";
  "./pages/order/payment-success.js";
  "./pages/order/payment-fail.js";
  "./pages/user/coupon.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
    const token = common_vendor.index.getStorageSync("token");
    if (token) {
      common_vendor.index.__f__("log", "at App.vue:8", "已登录");
    }
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:12", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:15", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  const pinia = common_vendor.createPinia();
  app.use(pinia);
  return { app, pinia };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
