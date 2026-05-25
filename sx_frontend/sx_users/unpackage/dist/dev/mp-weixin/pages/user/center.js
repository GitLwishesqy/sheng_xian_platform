"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
const common_icons = require("../../common/icons.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  setup() {
    return { ICON: common_icons.ICON };
  },
  computed: {
    isLogin() {
      return stores_user.useUserStore().isLogin;
    },
    userInfo() {
      return stores_user.useUserStore().userInfo;
    }
  },
  onShow() {
    if (stores_user.useUserStore().token && !stores_user.useUserStore().userInfo) {
      stores_user.useUserStore().fetchUserInfo();
    }
  },
  methods: {
    goLogin() {
      common_vendor.index.navigateTo({ url: "/pages/user/login" });
    },
    goOrderList(status) {
      common_vendor.index.navigateTo({ url: "/pages/order/list?status=" + status });
    },
    goAddressList() {
      common_vendor.index.navigateTo({ url: "/pages/user/address" });
    },
    goCouponList() {
      common_vendor.index.navigateTo({ url: "/pages/user/coupon" });
    },
    goPickupPoints() {
      common_vendor.index.showToast({ title: "开发中", icon: "none" });
    },
    logout() {
      stores_user.useUserStore().logout();
      common_vendor.index.showToast({ title: "已退出登录", icon: "success" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$options.isLogin
  }, !$options.isLogin ? {
    b: common_assets._imports_0,
    c: common_vendor.o((...args) => $options.goLogin && $options.goLogin(...args))
  } : common_vendor.e({
    d: $options.userInfo.avatar || "/static/images/default-avatar.png",
    e: common_vendor.t($options.userInfo.nickname || "用户"),
    f: $options.userInfo.phone
  }, $options.userInfo.phone ? {
    g: common_vendor.t($options.userInfo.phone)
  } : {}), {
    h: common_vendor.o(($event) => $options.goOrderList("")),
    i: $setup.ICON.pendingPay,
    j: common_vendor.o(($event) => $options.goOrderList(1)),
    k: $setup.ICON.pendingDelivery,
    l: common_vendor.o(($event) => $options.goOrderList(2)),
    m: $setup.ICON.shipped,
    n: common_vendor.o(($event) => $options.goOrderList(3)),
    o: $setup.ICON.completed,
    p: common_vendor.o(($event) => $options.goOrderList(5)),
    q: $setup.ICON.address,
    r: common_vendor.o((...args) => $options.goAddressList && $options.goAddressList(...args)),
    s: $setup.ICON.coupon,
    t: common_vendor.o((...args) => $options.goCouponList && $options.goCouponList(...args)),
    v: $setup.ICON.pickup,
    w: common_vendor.o((...args) => $options.goPickupPoints && $options.goPickupPoints(...args)),
    x: $options.isLogin
  }, $options.isLogin ? {
    y: $setup.ICON.logout,
    z: common_vendor.o((...args) => $options.logout && $options.logout(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ba03e1e9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/center.js.map
