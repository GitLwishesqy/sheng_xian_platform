"use strict";
const common_vendor = require("../common/vendor.js");
const api_user = require("../api/user.js");
const useUserStore = common_vendor.defineStore("user", () => {
  const token = common_vendor.ref(common_vendor.index.getStorageSync("token") || "");
  const userInfo = common_vendor.ref(null);
  const isLogin = common_vendor.computed(() => !!token.value);
  async function loginByWechat() {
    return new Promise((resolve, reject) => {
      common_vendor.index.login({
        provider: "weixin",
        success: async (loginRes) => {
          try {
            const res = await api_user.userApi.loginByWechat(loginRes.code);
            if (res.code === 200) {
              token.value = res.data.token;
              common_vendor.index.setStorageSync("token", res.data.token);
              await fetchUserInfo();
              resolve(res);
            } else {
              reject(res);
            }
          } catch (e) {
            reject(e);
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }
  async function loginByPhone(phone, code) {
    const res = await api_user.userApi.loginByPhone(phone, code);
    if (res.code === 200) {
      token.value = res.data.token;
      common_vendor.index.setStorageSync("token", res.data.token);
      await fetchUserInfo();
    }
    return res;
  }
  async function fetchUserInfo() {
    try {
      const res = await api_user.userApi.getUserInfo();
      if (res.code === 200) {
        userInfo.value = res.data;
        common_vendor.index.setStorageSync("userInfo", JSON.stringify(res.data));
      }
    } catch (e) {
      common_vendor.index.__f__("error", "at stores/user.js:57", "获取用户信息失败", e);
    }
  }
  function logout() {
    token.value = "";
    userInfo.value = null;
    common_vendor.index.removeStorageSync("token");
    common_vendor.index.removeStorageSync("userInfo");
  }
  return { token, userInfo, isLogin, loginByWechat, loginByPhone, fetchUserInfo, logout };
});
exports.useUserStore = useUserStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/stores/user.js.map
