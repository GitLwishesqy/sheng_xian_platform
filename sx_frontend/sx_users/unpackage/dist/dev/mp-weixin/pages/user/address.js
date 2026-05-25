"use strict";
const common_vendor = require("../../common/vendor.js");
const api_address = require("../../api/address.js");
const common_icons = require("../../common/icons.js");
const _sfc_main = {
  setup() {
    return { ICON: common_icons.ICON };
  },
  data() {
    return { addressList: [], selectMode: false };
  },
  onLoad(options) {
    if (options.mode === "select")
      this.selectMode = true;
  },
  onShow() {
    this.loadAddresses();
  },
  methods: {
    async loadAddresses() {
      const res = await api_address.addressApi.getAddressList();
      if (res.code === 200)
        this.addressList = res.data || [];
    },
    selectAddress(addr) {
      if (!this.selectMode)
        return;
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      if (prevPage) {
        prevPage.$vm.selectedAddress = addr;
      }
      common_vendor.index.navigateBack();
    },
    editAddress(addr) {
      const params = addr ? "?id=" + addr.id : "";
      common_vendor.index.navigateTo({ url: "/pages/user/address-edit" + params });
    },
    async deleteAddress(id) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定删除该地址？",
        success: async (res) => {
          if (res.confirm) {
            await api_address.addressApi.deleteAddress(id);
            this.loadAddresses();
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.addressList, (addr, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(addr.receiverName),
        b: common_vendor.t(addr.receiverPhone),
        c: addr.isDefault
      }, addr.isDefault ? {} : {}, {
        d: common_vendor.t(addr.province),
        e: common_vendor.t(addr.city),
        f: common_vendor.t(addr.district),
        g: common_vendor.t(addr.detailAddress),
        h: common_vendor.o(($event) => $options.selectAddress(addr), addr.id),
        i: common_vendor.o(($event) => $options.editAddress(addr), addr.id),
        j: common_vendor.o(($event) => $options.deleteAddress(addr.id), addr.id),
        k: addr.id
      });
    }),
    b: $data.addressList.length === 0
  }, $data.addressList.length === 0 ? {
    c: $setup.ICON.location
  } : {}, {
    d: common_vendor.o(($event) => $options.editAddress())
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-741c9688"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/address.js.map
