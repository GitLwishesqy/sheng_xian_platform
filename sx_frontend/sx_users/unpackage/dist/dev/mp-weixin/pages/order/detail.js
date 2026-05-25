"use strict";
const common_vendor = require("../../common/vendor.js");
const api_order = require("../../api/order.js");
const common_icons = require("../../common/icons.js");
const _sfc_main = {
  setup() {
    return { ICON: common_icons.ICON, getOrderStatusIcon: common_icons.getOrderStatusIcon };
  },
  data() {
    return {
      id: "",
      order: {},
      defaultImg: "/static/images/default-product.png"
    };
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id;
      this.loadData();
    }
  },
  methods: {
    async loadData() {
      const res = await api_order.orderApi.getOrderDetail(this.id);
      if (res.code === 200)
        this.order = res.data;
    },
    statusText(s) {
      const map = { 1: "待付款", 2: "待发货", 3: "待收货", 4: "已签收", 5: "已完成", 6: "已取消", 7: "退款中", 8: "已退款" };
      return map[s] || "未知";
    },
    async cancelOrder() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定取消订单？",
        success: async (res) => {
          if (res.confirm) {
            await api_order.orderApi.cancelOrder(this.id);
            this.loadData();
          }
        }
      });
    },
    payOrder() {
      common_vendor.index.navigateTo({ url: "/pages/order/payment?id=" + this.id });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.order.orderNo
  }, $data.order.orderNo ? common_vendor.e({
    b: $setup.getOrderStatusIcon($data.order.orderStatus),
    c: common_vendor.t($options.statusText($data.order.orderStatus)),
    d: $data.order.orderStatus === 1
  }, $data.order.orderStatus === 1 ? {} : {}, {
    e: $data.order.deliveryType === 1 && $data.order.addressSnapshot
  }, $data.order.deliveryType === 1 && $data.order.addressSnapshot ? {
    f: $setup.ICON.location,
    g: common_vendor.t($data.order.addressSnapshot)
  } : {}, {
    h: common_vendor.f($data.order.items, (item, k0, i0) => {
      return common_vendor.e({
        a: item.productImage || $data.defaultImg,
        b: common_vendor.t(item.productName),
        c: item.specInfo
      }, item.specInfo ? {
        d: common_vendor.t(item.specInfo)
      } : {}, {
        e: common_vendor.t(item.price),
        f: common_vendor.t(item.quantity),
        g: item.id
      });
    }),
    i: common_vendor.t($data.order.orderNo),
    j: common_vendor.t($data.order.createTime),
    k: common_vendor.t($data.order.deliveryType === 1 ? "配送到家" : "到店自提"),
    l: $data.order.paymentTime
  }, $data.order.paymentTime ? {
    m: common_vendor.t($data.order.paymentTime)
  } : {}, {
    n: $data.order.remark
  }, $data.order.remark ? {
    o: common_vendor.t($data.order.remark)
  } : {}, {
    p: common_vendor.t($data.order.totalAmount),
    q: common_vendor.t($data.order.deliveryFee || 0),
    r: $data.order.discountAmount
  }, $data.order.discountAmount ? {
    s: common_vendor.t($data.order.discountAmount)
  } : {}, {
    t: common_vendor.t($data.order.payAmount),
    v: $data.order.orderStatus === 1
  }, $data.order.orderStatus === 1 ? {
    w: common_vendor.o((...args) => $options.cancelOrder && $options.cancelOrder(...args)),
    x: common_vendor.o((...args) => $options.payOrder && $options.payOrder(...args))
  } : {}) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-6b23c96c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/detail.js.map
