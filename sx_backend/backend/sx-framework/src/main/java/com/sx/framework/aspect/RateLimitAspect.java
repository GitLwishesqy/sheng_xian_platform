package com.sx.framework.aspect;

import com.sx.common.exception.BusinessException;
import com.sx.common.result.ResultCode;
import com.sx.framework.annotation.RateLimit;
import com.sx.framework.security.UserContext;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.scripting.support.ResourceScriptSource;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.util.Collections;

@Aspect
@Component
public class RateLimitAspect {

    private static final Logger log = LoggerFactory.getLogger(RateLimitAspect.class);

    private final RedisTemplate<String, Object> redisTemplate;
    private DefaultRedisScript<Long> redisScript;

    public RateLimitAspect(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @PostConstruct
    public void init() {
        redisScript = new DefaultRedisScript<>();
        redisScript.setScriptSource(new ResourceScriptSource(new ClassPathResource("lua/rate_limit.lua")));
        redisScript.setResultType(Long.class);
    }

    @Around("@annotation(rateLimit)")
    public Object around(ProceedingJoinPoint joinPoint, RateLimit rateLimit) throws Throwable {
        String key = buildKey(joinPoint, rateLimit);
        int window = rateLimit.window();
        int maxRequests = rateLimit.maxRequests();
        long now = System.currentTimeMillis();

        Long result = redisTemplate.execute(
                redisScript,
                Collections.singletonList(key),
                String.valueOf(window),
                String.valueOf(maxRequests),
                String.valueOf(now)
        );

        if (result != null && result == 1) {
            return joinPoint.proceed();
        }

        log.warn("接口限流触发, key: {}, window: {}s, max: {}", key, window, maxRequests);
        throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), rateLimit.message());
    }

    private String buildKey(ProceedingJoinPoint joinPoint, RateLimit rateLimit) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        String methodKey = rateLimit.key() + method.getDeclaringClass().getSimpleName() + ":" + method.getName();

        if (rateLimit.perUser()) {
            Long userId = UserContext.getUserId();
            if (userId != null) {
                return methodKey + ":user:" + userId;
            }
        }
        if (rateLimit.perIp()) {
            String ip = getClientIp();
            if (ip != null) {
                return methodKey + ":ip:" + ip;
            }
        }
        return methodKey + ":global";
    }

    private String getClientIp() {
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs == null) return null;
            HttpServletRequest request = attrs.getRequest();
            String ip = request.getHeader("X-Forwarded-For");
            if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getHeader("X-Real-IP");
            }
            if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getRemoteAddr();
            }
            return ip;
        } catch (Exception e) {
            return null;
        }
    }
}
