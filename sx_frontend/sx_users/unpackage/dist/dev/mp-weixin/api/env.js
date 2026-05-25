"use strict";
const ENV = {
  // 开发环境 — 改为你的本机 IP
  dev: "http://10.157.148.39:8090",
  // 生产环境
  prod: "https://api.your-domain.com"
};
const CURRENT = "dev";
const BASE_URL = ENV[CURRENT];
exports.BASE_URL = BASE_URL;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/env.js.map
