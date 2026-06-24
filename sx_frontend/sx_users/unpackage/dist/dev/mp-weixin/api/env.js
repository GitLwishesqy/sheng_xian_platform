"use strict";
const ENV = {
  // 开发环境 
  dev: "http://192.168.10.178:8090",
  // 生产环境
  prod: "https://api.your-domain.com"
};
const CURRENT = "dev";
const BASE_URL = ENV[CURRENT];
exports.BASE_URL = BASE_URL;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/env.js.map
