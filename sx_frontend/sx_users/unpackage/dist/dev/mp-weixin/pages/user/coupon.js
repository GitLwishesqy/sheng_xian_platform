"use strict";
const common_vendor = require("../../common/vendor.js");
const api_coupon = require("../../api/coupon.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      availableCoupons: [],
      myCoupons: [],
      selectMode: false
    };
  },
  onLoad(options) {
    if (options.mode === "select")
      this.selectMode = true;
    this.loadData();
  },
  methods: {
    async loadData() {
      const [availRes, myRes] = await Promise.all([
        api_coupon.couponApi.getAvailableCoupons(),
        api_coupon.couponApi.getMyCoupons()
      ]);
      if (availRes.code === 200)
        this.availableCoupons = availRes.data || [];
      if (myRes.code === 200)
        this.myCoupons = myRes.data || [];
    },
    async receiveCoupon(id) {
      const res = await api_coupon.couponApi.receiveCoupon(id);
      if (res.code === 200) {
        common_vendor.index.showToast({ title: "领取成功", icon: "success" });
        this.loadData();
      }
    },
    selectCoupon(cp) {
      if (!this.selectMode || cp.status !== 1)
        return;
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      if (prevPage) {
        prevPage.$vm.selectedCoupon = cp;
      }
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.selectMode
  }, !$data.selectMode ? common_vendor.e({
    b: common_assets._imports_0$2,
    c: common_vendor.f($data.availableCoupons, (cp, k0, i0) => {
      return common_vendor.e({
        a: cp.type === 1
      }, cp.type === 1 ? {
        b: common_vendor.t(cp.discountValue)
      } : cp.type === 2 ? {
        d: common_vendor.t(cp.discountValue)
      } : {
        e: common_vendor.t(cp.discountValue)
      }, {
        c: cp.type === 2,
        f: cp.minAmount > 0
      }, cp.minAmount > 0 ? {
        g: common_vendor.t(cp.minAmount)
      } : {}, {
        h: common_vendor.t(cp.name),
        i: common_vendor.t(cp.endTime),
        j: common_vendor.o(($event) => $options.receiveCoupon(cp.id), cp.id),
        k: cp.id
      });
    }),
    d: $data.availableCoupons.length === 0
  }, $data.availableCoupons.length === 0 ? {} : {}) : {}, {
    e: common_vendor.t($data.selectMode ? "选择优惠券" : "我的优惠券"),
    f: common_vendor.f($data.myCoupons, (cp, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(cp.discountValue),
        b: cp.status === 2
      }, cp.status === 2 ? {} : cp.status === 3 ? {} : {}, {
        c: cp.status === 3,
        d: common_vendor.t(cp.name),
        e: common_vendor.t(cp.endTime),
        f: cp.id,
        g: cp.status !== 1 ? 1 : "",
        h: common_vendor.o(($event) => $options.selectCoupon(cp), cp.id)
      });
    }),
    g: $data.myCoupons.length === 0
  }, $data.myCoupons.length === 0 ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a16c15a9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/coupon.js.map
