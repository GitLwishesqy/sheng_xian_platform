package com.sx.user.service.impl;

import com.sx.user.service.SmsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
public class SmsServiceImpl implements SmsService {

    private static final Logger log = LoggerFactory.getLogger(SmsServiceImpl.class);
    private static final String SMS_PREFIX = "sms:code:";
    private static final int CODE_EXPIRE_MINUTES = 5;

    private final RedisTemplate<String, Object> redisTemplate;

    public SmsServiceImpl(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public String sendCode(String phone) {
        // 60秒内不能重复发送
        String limitKey = SMS_PREFIX + "limit:" + phone;
        if (Boolean.TRUE.equals(redisTemplate.hasKey(limitKey))) {
            return null;
        }

        String code = String.format("%06d", new Random().nextInt(1000000));
        String codeKey = SMS_PREFIX + phone;
        redisTemplate.opsForValue().set(codeKey, code, CODE_EXPIRE_MINUTES, TimeUnit.MINUTES);
        redisTemplate.opsForValue().set(limitKey, "1", 60, TimeUnit.SECONDS);

        log.info("【模拟短信】手机号: {}, 验证码: {}", phone, code);
        return code;
    }

    @Override
    public boolean verifyCode(String phone, String code) {
        String codeKey = SMS_PREFIX + phone;
        String stored = (String) redisTemplate.opsForValue().get(codeKey);
        if (stored != null && stored.equals(code)) {
            redisTemplate.delete(codeKey);
            return true;
        }
        return false;
    }
}
