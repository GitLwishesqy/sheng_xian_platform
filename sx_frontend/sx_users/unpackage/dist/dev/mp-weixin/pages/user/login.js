"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
const api_user = require("../../api/user.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      phone: "",
      code: "",
      codeCountdown: 0,
      isMpWeixin: false
    };
  },
  onLoad() {
    this.isMpWeixin = true;
  },
  methods: {
    async sendCode() {
      if (!this.phone || this.phone.length !== 11) {
        common_vendor.index.showToast({ title: "请输入正确手机号", icon: "none" });
        return;
      }
      try {
        const res = await api_user.userApi.sendSms(this.phone);
        if (res.code === 200) {
          common_vendor.index.showToast({ title: "验证码已发送", icon: "success" });
          if (res.data && res.data.code) {
            common_vendor.index.__f__("log", "at pages/user/login.vue:60", "【开发模式】验证码:", res.data.code);
          }
          this.codeCountdown = 60;
          const timer = setInterval(() => {
            this.codeCountdown--;
            if (this.codeCountdown <= 0)
              clearInterval(timer);
          }, 1e3);
        } else {
          common_vendor.index.showToast({ title: res.message || "发送失败", icon: "none" });
        }
      } catch (e) {
        common_vendor.index.showToast({ title: "发送失败，请稍后重试", icon: "none" });
      }
    },
    async handleLogin() {
      if (!this.phone) {
        common_vendor.index.showToast({ title: "请输入手机号", icon: "none" });
        return;
      }
      if (!this.code) {
        common_vendor.index.showToast({ title: "请输入验证码", icon: "none" });
        return;
      }
      try {
        await stores_user.useUserStore().loginByPhone(this.phone, this.code);
        common_vendor.index.showToast({ title: "登录成功", icon: "success" });
        setTimeout(() => common_vendor.index.navigateBack(), 1e3);
      } catch (e) {
        common_vendor.index.showToast({ title: e.message || "登录失败", icon: "none" });
      }
    },
    async handleWechatLogin() {
      try {
        await stores_user.useUserStore().loginByWechat();
        common_vendor.index.showToast({ title: "登录成功", icon: "success" });
        setTimeout(() => common_vendor.index.navigateBack(), 1e3);
      } catch (e) {
        common_vendor.index.showToast({ title: "登录失败，请重试", icon: "none" });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0$1,
    b: !$data.isMpWeixin
  }, !$data.isMpWeixin ? {
    c: $data.phone,
    d: common_vendor.o(($event) => $data.phone = $event.detail.value),
    e: $data.code,
    f: common_vendor.o(($event) => $data.code = $event.detail.value),
    g: common_vendor.t($data.codeCountdown > 0 ? $data.codeCountdown + "s" : "获取验证码"),
    h: common_vendor.o((...args) => $options.sendCode && $options.sendCode(...args)),
    i: $data.codeCountdown > 0,
    j: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args))
  } : {
    k: common_assets._imports_1,
    l: common_vendor.o((...args) => $options.handleWechatLogin && $options.handleWechatLogin(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-6163e5ce"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/login.js.map
