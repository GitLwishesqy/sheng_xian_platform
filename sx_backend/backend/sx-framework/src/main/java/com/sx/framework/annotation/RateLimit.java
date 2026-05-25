package com.sx.framework.annotation;

import java.lang.annotation.*;

/**
 * 滑动窗口限流注解，支持全局和用户级别
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RateLimit {

    /** 限流key前缀 */
    String key() default "rate:limit:";

    /** 窗口大小（秒） */
    int window() default 60;

    /** 窗口内最大请求数 */
    int maxRequests() default 30;

    /** 是否按用户限流（true则key追加userId） */
    boolean perUser() default false;

    /** 是否按IP限流（true则key追加请求IP） */
    boolean perIp() default false;

    /** 限流提示 */
    String message() default "请求过于频繁，请稍后再试";
}
