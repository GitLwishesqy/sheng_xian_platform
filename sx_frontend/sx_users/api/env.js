const ENV = {
    // 开发环境 
    dev: 'http://192.168.10.178:8090',
    // 生产环境
    prod: 'https://api.your-domain.com'
}

// 切换环境：'dev' 或 'prod'
const CURRENT = 'dev'

export const BASE_URL = ENV[CURRENT]
export default ENV
