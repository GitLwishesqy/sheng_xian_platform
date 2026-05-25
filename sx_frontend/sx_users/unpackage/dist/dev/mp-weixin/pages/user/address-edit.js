"use strict";
const common_vendor = require("../../common/vendor.js");
const api_address = require("../../api/address.js");
const _sfc_main = {
  data() {
    return {
      id: "",
      form: {
        receiverName: "",
        receiverPhone: "",
        province: "",
        city: "",
        district: "",
        detailAddress: "",
        isDefault: 0
      },
      region: [],
      regionText: "",
      showRegionPicker: false
    };
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id;
      this.loadAddress();
    }
  },
  methods: {
    async loadAddress() {
      const res = await api_address.addressApi.getAddressList();
      if (res.code === 200) {
        const addr = (res.data || []).find((a) => a.id == this.id);
        if (addr) {
          this.form = { ...addr };
          this.region = [addr.province, addr.city, addr.district];
          this.regionText = addr.province + " " + addr.city + " " + addr.district;
        }
      }
    },
    onRegionChange(e) {
      const [province, city, district] = e.detail.value;
      this.form.province = province;
      this.form.city = city;
      this.form.district = district;
      this.regionText = province + " " + city + " " + district;
      this.region = e.detail.value;
    },
    async saveAddress() {
      if (!this.form.receiverName) {
        common_vendor.index.showToast({ title: "请输入收货人", icon: "none" });
        return;
      }
      if (!this.form.receiverPhone) {
        common_vendor.index.showToast({ title: "请输入手机号", icon: "none" });
        return;
      }
      if (!this.form.detailAddress) {
        common_vendor.index.showToast({ title: "请输入详细地址", icon: "none" });
        return;
      }
      if (this.id) {
        await api_address.addressApi.updateAddress(this.id, this.form);
      } else {
        await api_address.addressApi.addAddress(this.form);
      }
      common_vendor.index.showToast({ title: "保存成功", icon: "success" });
      setTimeout(() => common_vendor.index.navigateBack(), 1e3);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.form.receiverName,
    b: common_vendor.o(($event) => $data.form.receiverName = $event.detail.value),
    c: $data.form.receiverPhone,
    d: common_vendor.o(($event) => $data.form.receiverPhone = $event.detail.value),
    e: common_vendor.o(($event) => $data.showRegionPicker = true),
    f: $data.regionText,
    g: common_vendor.o(($event) => $data.regionText = $event.detail.value),
    h: $data.form.detailAddress,
    i: common_vendor.o(($event) => $data.form.detailAddress = $event.detail.value),
    j: $data.form.isDefault === 1,
    k: common_vendor.o(($event) => $data.form.isDefault = $data.form.isDefault === 1 ? 0 : 1),
    l: common_vendor.o((...args) => $options.saveAddress && $options.saveAddress(...args)),
    m: $data.showRegionPicker
  }, $data.showRegionPicker ? {
    n: $data.region,
    o: common_vendor.o((...args) => $options.onRegionChange && $options.onRegionChange(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-df3c8c7f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/address-edit.js.map
