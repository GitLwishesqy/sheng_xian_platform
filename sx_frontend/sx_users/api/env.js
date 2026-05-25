// 环境配置 — 修改此文件切换 API 地址
// 微信小程序模拟器中 localhost 不可用，需改为本机局域网 IP
// 示例：http://192.168.80.1:8090

const ENV = {
    // 开发环境 — 改为你的本机 IP
    dev: 'http://10.157.148.39:8090',
    // 生产环境
    prod: 'https://api.your-domain.com'
}

// 切换环境：'dev' 或 'prod'
const CURRENT = 'dev'

export const BASE_URL = ENV[CURRENT]
export default ENV
