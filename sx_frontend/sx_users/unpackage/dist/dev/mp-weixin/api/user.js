"use strict";
const api_request = require("./request.js");
const userApi = {
  // 微信登录
  loginByWechat(code) {
    return api_request.http.post("/api/v1/user/login/wechat", { code });
  },
  // 手机号登录
  loginByPhone(phone, code) {
    return api_request.http.post("/api/v1/user/login/phone", { phone, code });
  },
  // 获取用户信息
  getUserInfo() {
    return api_request.http.get("/api/v1/user/info");
  },
  // 修改用户信息
  updateUserInfo(data) {
    return api_request.http.put("/api/v1/user/info", data);
  },
  // 发送短信验证码
  sendSms(phone) {
    return api_request.http.post("/api/v1/user/login/sms/send", { phone });
  }
};
exports.userApi = userApi;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/user.js.map
