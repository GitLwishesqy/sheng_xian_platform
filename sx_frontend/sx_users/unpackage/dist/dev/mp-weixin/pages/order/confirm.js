"use strict";
const common_vendor = require("../../common/vendor.js");
const api_address = require("../../api/address.js");
const api_order = require("../../api/order.js");
const api_request = require("../../api/request.js");
const common_icons = require("../../common/icons.js");
const _sfc_main = {
  setup() {
    return { ICON: common_icons.ICON };
  },
  data() {
    return {
      orderItems: [],
      selectedAddress: null,
      selectedPickupPoint: null,
      deliveryType: 1,
      deliveryFee: 5,
      totalAmount: 0,
      discountAmount: 0,
      payAmount: 0,
      selectedCoupon: null,
      remark: "",
      submitting: false,
      defaultImg: "/static/images/default-product.png"
    };
  },
  onLoad(options) {
    if (options.items) {
      try {
        this.orderItems = JSON.parse(decodeURIComponent(options.items));
      } catch {
        this.orderItems = [];
      }
    }
    this.calcAmount();
    this.loadAddress().catch(() => {
    });
    this.loadItemImages().catch(() => {
    });
  },
  onShow() {
    this.submitting = false;
  },
  methods: {
    async loadAddress() {
      try {
        const res = await api_address.addressApi.getAddressList();
        if (res.code === 200) {
          const list = res.data || [];
          this.selectedAddress = list.find((a) => a.isDefault) || list[0] || null;
        }
      } catch (e) {
      }
    },
    calcAmount() {
      this.totalAmount = this.orderItems.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
      this.payAmount = this.totalAmount + this.deliveryFee - this.discountAmount;
    },
    goAddress() {
      common_vendor.index.navigateTo({ url: "/pages/user/address?mode=select" });
    },
    goPickup() {
      common_vendor.index.navigateTo({ url: "/pages/user/pickup?mode=select" });
    },
    goCoupon() {
      common_vendor.index.navigateTo({ url: "/pages/user/coupon?mode=select&amount=" + this.totalAmount });
    },
    setDelivery(type) {
      this.deliveryType = type;
      this.deliveryFee = type === 1 ? 5 : 0;
      this.calcAmount();
    },
    async loadItemImages() {
      const promises = this.orderItems.filter((item) => !item.productImage && item.productId).map(
        (item) => api_request.http.get("/api/v1/product/" + item.productId, {}, true).then((res) => {
          if (res.code === 200 && res.data) {
            item.productImage = res.data.coverImage || "";
          }
        }).catch(() => {
        })
      );
      if (promises.length > 0) {
        await Promise.all(promises);
      }
    },
    async submitOrder() {
      if (this.submitting)
        return;
      if (this.deliveryType === 1 && !this.selectedAddress) {
        common_vendor.index.showToast({ title: "请选择收货地址", icon: "none" });
        return;
      }
      if (this.deliveryType === 2 && !this.selectedPickupPoint) {
        common_vendor.index.showToast({ title: "请选择自提点", icon: "none" });
        return;
      }
      this.submitting = true;
      const data = {
        deliveryType: this.deliveryType,
        items: this.orderItems.map((i) => ({
          productId: i.productId,
          skuId: i.skuId,
          quantity: i.quantity || 1
        })),
        remark: this.remark
      };
      if (this.deliveryType === 1 && this.selectedAddress)
        data.addressId = this.selectedAddress.id;
      if (this.deliveryType === 2 && this.selectedPickupPoint)
        data.pickupPointId = this.selectedPickupPoint.id;
      if (this.selectedCoupon)
        data.couponId = this.selectedCoupon.id;
      try {
        const res = await api_order.orderApi.createOrder(data);
        if (res.code === 200 && res.data && res.data.id) {
          common_vendor.index.showToast({ title: "下单成功", icon: "success" });
          this.$nextTick(() => {
            common_vendor.index.navigateTo({ url: "/pages/order/payment?id=" + res.data.id });
          });
          return;
        }
      } catch (e) {
        common_vendor.index.showToast({ title: "网络异常，请检查后端服务", icon: "none" });
      }
      this.submitting = false;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.deliveryType === 1
  }, $data.deliveryType === 1 ? common_vendor.e({
    b: $data.selectedAddress
  }, $data.selectedAddress ? common_vendor.e({
    c: common_vendor.t($data.selectedAddress.receiverName),
    d: common_vendor.t($data.selectedAddress.receiverPhone),
    e: $data.selectedAddress.isDefault
  }, $data.selectedAddress.isDefault ? {} : {}, {
    f: common_vendor.t($data.selectedAddress.province),
    g: common_vendor.t($data.selectedAddress.city),
    h: common_vendor.t($data.selectedAddress.district),
    i: common_vendor.t($data.selectedAddress.detailAddress)
  }) : {
    j: $setup.ICON.location
  }, {
    k: common_vendor.o((...args) => $options.goAddress && $options.goAddress(...args))
  }) : {}, {
    l: $data.deliveryType === 2
  }, $data.deliveryType === 2 ? common_vendor.e({
    m: $data.selectedPickupPoint
  }, $data.selectedPickupPoint ? common_vendor.e({
    n: $setup.ICON.pickup,
    o: common_vendor.t($data.selectedPickupPoint.name),
    p: common_vendor.t($data.selectedPickupPoint.address),
    q: $data.selectedPickupPoint.phone || $data.selectedPickupPoint.businessHours
  }, $data.selectedPickupPoint.phone || $data.selectedPickupPoint.businessHours ? common_vendor.e({
    r: $data.selectedPickupPoint.phone
  }, $data.selectedPickupPoint.phone ? {
    s: common_vendor.t($data.selectedPickupPoint.phone)
  } : {}, {
    t: $data.selectedPickupPoint.businessHours
  }, $data.selectedPickupPoint.businessHours ? {
    v: common_vendor.t($data.selectedPickupPoint.businessHours)
  } : {}) : {}) : {
    w: $setup.ICON.pickup
  }, {
    x: common_vendor.o((...args) => $options.goPickup && $options.goPickup(...args))
  }) : {}, {
    y: $setup.ICON.homeDelivery,
    z: common_vendor.n($data.deliveryType === 1 ? "active" : ""),
    A: common_vendor.o(($event) => $options.setDelivery(1)),
    B: $setup.ICON.selfPickup,
    C: common_vendor.n($data.deliveryType === 2 ? "active" : ""),
    D: common_vendor.o(($event) => $options.setDelivery(2)),
    E: common_vendor.f($data.orderItems, (item, k0, i0) => {
      return common_vendor.e({
        a: item.productImage || $data.defaultImg,
        b: common_vendor.t(item.productName),
        c: item.specInfo
      }, item.specInfo ? {
        d: common_vendor.t(item.specInfo)
      } : {}, {
        e: common_vendor.t(item.price),
        f: common_vendor.t(item.quantity),
        g: item.productId
      });
    }),
    F: common_vendor.t($data.selectedCoupon ? "¥" + $data.selectedCoupon.discountValue : "选择优惠券"),
    G: common_vendor.o((...args) => $options.goCoupon && $options.goCoupon(...args)),
    H: common_vendor.t($data.totalAmount.toFixed(2)),
    I: common_vendor.t($data.deliveryFee.toFixed(2)),
    J: $data.discountAmount > 0
  }, $data.discountAmount > 0 ? {
    K: common_vendor.t($data.discountAmount.toFixed(2))
  } : {}, {
    L: common_vendor.t($data.payAmount.toFixed(2)),
    M: common_vendor.t($data.submitting ? "提交中..." : "提交订单"),
    N: $data.submitting,
    O: $data.submitting,
    P: common_vendor.o((...args) => $options.submitOrder && $options.submitOrder(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-324e7894"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/confirm.js.map
