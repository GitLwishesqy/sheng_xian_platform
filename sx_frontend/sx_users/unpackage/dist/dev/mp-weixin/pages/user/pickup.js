"use strict";
const common_vendor = require("../../common/vendor.js");
const api_pickup = require("../../api/pickup.js");
const common_icons = require("../../common/icons.js");
const _sfc_main = {
  setup() {
    return { ICON: common_icons.ICON };
  },
  data() {
    return { pickupList: [], loading: false, selectMode: false };
  },
  onLoad(options) {
    if (options.mode === "select")
      this.selectMode = true;
  },
  onShow() {
    this.loadPickupPoints();
  },
  methods: {
    async loadPickupPoints() {
      this.loading = true;
      try {
        const res = await api_pickup.pickupApi.getPickupList();
        if (res.code === 200)
          this.pickupList = res.data || [];
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/user/pickup.vue:44", "加载自提点失败", e);
      } finally {
        this.loading = false;
      }
    },
    selectPoint(point) {
      if (!this.selectMode)
        return;
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      if (prevPage) {
        prevPage.$vm.selectedPickupPoint = point;
      }
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.pickupList, (point, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(point.name),
        b: common_vendor.t(point.address),
        c: point.phone || point.businessHours
      }, point.phone || point.businessHours ? common_vendor.e({
        d: point.phone
      }, point.phone ? {
        e: common_vendor.t(point.phone)
      } : {}, {
        f: point.businessHours
      }, point.businessHours ? {
        g: common_vendor.t(point.businessHours)
      } : {}) : {}, {
        h: point.id,
        i: common_vendor.o(($event) => $options.selectPoint(point), point.id)
      });
    }),
    b: $setup.ICON.pickup,
    c: $data.pickupList.length === 0 && !$data.loading
  }, $data.pickupList.length === 0 && !$data.loading ? {
    d: $setup.ICON.pickup
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5851fc16"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/pickup.js.map
