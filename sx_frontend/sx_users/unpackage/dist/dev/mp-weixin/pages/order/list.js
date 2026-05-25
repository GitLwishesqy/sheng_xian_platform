"use strict";
const common_vendor = require("../../common/vendor.js");
const api_order = require("../../api/order.js");
const common_icons = require("../../common/icons.js");
const _sfc_main = {
  setup() {
    return { ICON: common_icons.ICON };
  },
  data() {
    return {
      tabs: [
        { label: "全部", value: "" },
        { label: "待付款", value: "1" },
        { label: "待发货", value: "2" },
        { label: "待收货", value: "3" },
        { label: "已完成", value: "5" }
      ],
      currentTab: "",
      orders: [],
      page: 1,
      loading: false,
      noMore: false,
      defaultImg: "/static/images/default-product.png"
    };
  },
  onShow() {
    this.page = 1;
    this.noMore = false;
    this.orders = [];
    this.loadOrders();
  },
  methods: {
    async loadOrders() {
      if (this.loading || this.noMore)
        return;
      this.loading = true;
      try {
        const params = { page: this.page, pageSize: 10 };
        if (this.currentTab)
          params.orderStatus = parseInt(this.currentTab);
        const res = await api_order.orderApi.getOrderList(params);
        if (res.code === 200) {
          const data = res.data;
          this.orders = this.page === 1 ? data.records : [...this.orders, ...data.records];
          this.noMore = data.records.length < 10;
        }
      } finally {
        this.loading = false;
      }
    },
    switchTab(val) {
      this.currentTab = val;
      this.page = 1;
      this.noMore = false;
      this.orders = [];
      this.loadOrders();
    },
    loadMore() {
      this.page++;
      this.loadOrders();
    },
    goDetail(id) {
      common_vendor.index.navigateTo({ url: "/pages/order/detail?id=" + id });
    },
    statusText(status) {
      const map = { 1: "待付款", 2: "待发货", 3: "待收货", 4: "已签收", 5: "已完成", 6: "已取消", 7: "退款中", 8: "已退款" };
      return map[status] || "未知";
    },
    async cancelOrder(order) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定取消订单？",
        success: async (res) => {
          if (res.confirm) {
            await api_order.orderApi.cancelOrder(order.id);
            common_vendor.index.showToast({ title: "已取消", icon: "success" });
            this.page = 1;
            this.noMore = false;
            this.orders = [];
            this.loadOrders();
          }
        }
      });
    },
    payOrder(order) {
      common_vendor.index.navigateTo({ url: "/pages/order/payment?id=" + order.id });
    },
    async confirmOrder(order) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确认已收到商品？",
        success: async (res) => {
          if (res.confirm) {
            await api_order.orderApi.confirmReceive(order.id);
            common_vendor.index.showToast({ title: "已确认收货", icon: "success" });
            this.page = 1;
            this.noMore = false;
            this.orders = [];
            this.loadOrders();
          }
        }
      });
    },
    applyRefund(order) {
      common_vendor.index.navigateTo({ url: "/pages/order/refund?id=" + order.id });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.tabs, (tab, idx, i0) => {
      return {
        a: common_vendor.t(tab.label),
        b: idx,
        c: common_vendor.n($data.currentTab === tab.value ? "active" : ""),
        d: common_vendor.o(($event) => $options.switchTab(tab.value), idx)
      };
    }),
    b: common_vendor.f($data.orders, (order, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(order.orderNo),
        b: common_vendor.t($options.statusText(order.orderStatus)),
        c: common_vendor.n("status-" + order.orderStatus),
        d: common_vendor.f(order.items || [], (item, k1, i1) => {
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
        e: common_vendor.t(order.items ? order.items.length : 0),
        f: common_vendor.t(order.payAmount),
        g: order.orderStatus === 1
      }, order.orderStatus === 1 ? {
        h: common_vendor.o(($event) => $options.cancelOrder(order), order.id),
        i: common_vendor.o(($event) => $options.payOrder(order), order.id)
      } : order.orderStatus === 3 ? {
        k: common_vendor.o(($event) => $options.confirmOrder(order), order.id)
      } : order.orderStatus === 2 ? {
        m: common_vendor.o(($event) => $options.applyRefund(order), order.id)
      } : {}, {
        j: order.orderStatus === 3,
        l: order.orderStatus === 2,
        n: order.id,
        o: common_vendor.o(($event) => $options.goDetail(order.id), order.id)
      });
    }),
    c: $data.loading
  }, $data.loading ? {} : {}, {
    d: $data.noMore && $data.orders.length > 0
  }, $data.noMore && $data.orders.length > 0 ? {} : {}, {
    e: !$data.loading && $data.orders.length === 0
  }, !$data.loading && $data.orders.length === 0 ? {
    f: $setup.ICON.pendingDelivery
  } : {}, {
    g: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-456ecf67"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/list.js.map
