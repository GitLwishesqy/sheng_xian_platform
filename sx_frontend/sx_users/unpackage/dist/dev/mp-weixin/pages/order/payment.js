"use strict";
const common_vendor = require("../../common/vendor.js");
const api_order = require("../../api/order.js");
const _sfc_main = {
  data() {
    return {
      orderId: "",
      orderNo: "",
      payAmount: 0,
      status: "pending",
      // pending | paid | cancelled
      qrcodeError: false,
      successIcon: "/static/images/icon-pay-success.png",
      failIcon: "/static/images/icon-pay-fail.png",
      successIconErr: false,
      failIconErr: false,
      pollTimer: null,
      pollCount: 0
    };
  },
  onLoad(options) {
    if (options.id) {
      this.orderId = options.id;
      this.orderNo = options.orderNo || "";
      if (options.amount) {
        this.payAmount = parseFloat(options.amount) || 0;
      }
      if (!String(this.orderId).startsWith("LOCAL")) {
        this.loadOrder();
      }
      this.startPolling();
    }
  },
  onUnload() {
    this.clearPolling();
  },
  methods: {
    async loadOrder() {
      try {
        const res = await api_order.orderApi.getOrderDetail(this.orderId);
        if (res.code === 200 && res.data) {
          const order = res.data;
          this.orderNo = order.orderNo || this.orderNo;
          this.payAmount = order.payAmount || this.payAmount;
          this.evaluateStatus(order.orderStatus);
        }
      } catch (e) {
      }
    },
    startPolling() {
      if (this.pollTimer)
        return;
      if (String(this.orderId).startsWith("LOCAL"))
        return;
      this.pollTimer = setInterval(() => {
        this.pollCount++;
        api_order.orderApi.getOrderDetail(this.orderId).then((res) => {
          if (res.code === 200 && res.data) {
            this.evaluateStatus(res.data.orderStatus);
          }
        }).catch(() => {
        });
        if (this.pollCount > 200) {
          this.clearPolling();
        }
      }, 3e3);
    },
    clearPolling() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer);
        this.pollTimer = null;
      }
    },
    evaluateStatus(orderStatus) {
      if (orderStatus === 2 || orderStatus === 3 || orderStatus === 4 || orderStatus === 5) {
        this.status = "paid";
        this.clearPolling();
      } else if (orderStatus === 6 || orderStatus === 7 || orderStatus === 8) {
        this.status = "cancelled";
        this.clearPolling();
      }
    },
    goHome() {
      common_vendor.index.switchTab({ url: "/pages/index/index" });
    },
    goBack() {
      this.clearPolling();
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.status === "paid"
  }, $data.status === "paid" ? common_vendor.e({
    b: $data.successIcon,
    c: common_vendor.o(($event) => $data.successIconErr = true),
    d: $data.successIconErr
  }, $data.successIconErr ? {} : {}, {
    e: common_vendor.t($data.payAmount.toFixed(2)),
    f: common_vendor.o((...args) => $options.goHome && $options.goHome(...args))
  }) : $data.status === "cancelled" ? common_vendor.e({
    h: $data.failIcon,
    i: common_vendor.o(($event) => $data.failIconErr = true),
    j: $data.failIconErr
  }, $data.failIconErr ? {} : {}, {
    k: common_vendor.t($data.payAmount.toFixed(2)),
    l: common_vendor.o((...args) => $options.goBack && $options.goBack(...args))
  }) : common_vendor.e({
    m: common_vendor.t($data.payAmount.toFixed(2)),
    n: common_vendor.t($data.orderNo),
    o: common_vendor.o(($event) => $data.qrcodeError = true),
    p: $data.qrcodeError
  }, $data.qrcodeError ? {} : {}, {
    q: common_vendor.t($data.payAmount.toFixed(2)),
    r: common_vendor.o((...args) => $options.goBack && $options.goBack(...args))
  }), {
    g: $data.status === "cancelled"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-13c3fb22"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/payment.js.map
