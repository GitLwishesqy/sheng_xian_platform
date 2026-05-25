-- 滑动窗口限流 Lua 脚本
-- KEYS[1]: 限流key
-- ARGV[1]: 窗口大小（秒）
-- ARGV[2]: 最大请求数
-- ARGV[3]: 当前时间戳（毫秒）
-- 返回值: 1=通过, 0=限流

local key = KEYS[1]
local window = tonumber(ARGV[1])
local maxRequests = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local windowStart = now - window * 1000

-- 移除窗口外的过期记录
redis.call('ZREMRANGEBYSCORE', key, 0, windowStart)

-- 获取当前窗口内的请求数
local current = redis.call('ZCARD', key)

if current < maxRequests then
    -- 记录本次请求
    redis.call('ZADD', key, now, now .. '-' .. current)
    -- 设置key过期时间（窗口大小 + 1秒缓冲）
    redis.call('EXPIRE', key, window + 1)
    return 1
else
    return 0
end
