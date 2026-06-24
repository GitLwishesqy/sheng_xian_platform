"use strict";
const common_vendor = require("../common/vendor.js");
const api_env = require("./env.js");
function request(options) {
  return new Promise((resolve, reject) => {
    const token = common_vendor.index.getStorageSync("token");
    const header = {
      "Content-Type": "application/json"
    };
    if (token) {
      header["Authorization"] = "Bearer " + token;
    }
    const silent = options.silent || false;
    common_vendor.index.request({
      url: api_env.BASE_URL + options.url,
      method: options.method || "GET",
      data: options.data || {},
      header,
      timeout: 3e4,
      success: (res) => {
        const { statusCode, data } = res;
        if (statusCode === 401 || statusCode === 403) {
          common_vendor.index.removeStorageSync("token");
          common_vendor.index.removeStorageSync("userInfo");
          if (!silent) {
            common_vendor.index.showToast({ title: "请先登录", icon: "none" });
          }
          setTimeout(() => {
            common_vendor.index.navigateTo({ url: "/pages/user/login" });
          }, 1e3);
          reject(data);
          return;
        }
        if (statusCode === 200) {
          if (data.code === 200) {
            resolve(data);
          } else if (data.code === 401) {
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.removeStorageSync("userInfo");
            if (!silent) {
              common_vendor.index.showToast({ title: "登录已过期，请重新登录", icon: "none" });
            }
            setTimeout(() => {
              common_vendor.index.navigateTo({ url: "/pages/user/login" });
            }, 1500);
            reject(data);
          } else {
            if (!silent) {
              common_vendor.index.showToast({ title: data.message || "请求失败", icon: "none" });
            }
            reject(data);
          }
        } else {
          if (!silent) {
            common_vendor.index.showToast({ title: "服务器繁忙，请稍后再试", icon: "none" });
          }
          reject(data);
        }
      },
      fail: (err) => {
        if (!silent) {
          common_vendor.index.showToast({ title: "网络连接失败", icon: "none" });
        }
        reject(err);
      }
    });
  });
}
function get(url, data = {}, silent = false) {
  return request({ url, method: "GET", data, silent });
}
function post(url, data = {}, silent = false) {
  return request({ url, method: "POST", data, silent });
}
function put(url, data = {}, silent = false) {
  return request({ url, method: "PUT", data, silent });
}
function del(url, data = {}, silent = false) {
  return request({ url, method: "DELETE", data, silent });
}
const http = { get, post, put, del, BASE_URL: api_env.BASE_URL };
exports.http = http;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/request.js.map
