"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      iconPath: "/static/images/icon-pay-fail.png",
      iconError: false,
      payAmount: 0
    };
  },
  onLoad(options) {
    if (options.amount) {
      this.payAmount = parseFloat(options.amount) || 0;
    }
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.iconPath,
    b: common_vendor.o(($event) => $data.iconError = true),
    c: $data.iconError
  }, $data.iconError ? {} : {}, {
    d: $data.payAmount > 0
  }, $data.payAmount > 0 ? {
    e: common_vendor.t($data.payAmount.toFixed(2))
  } : {}, {
    f: common_vendor.o((...args) => $options.goBack && $options.goBack(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-32c8645b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/payment-fail.js.map
