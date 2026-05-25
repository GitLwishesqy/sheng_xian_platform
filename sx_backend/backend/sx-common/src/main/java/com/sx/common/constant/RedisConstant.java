package com.sx.common.constant;

public interface RedisConstant {
    String TOKEN_PREFIX = "token:";
    String USER_INFO = "user:info:";
    String PRODUCT_STOCK = "product:stock:";
    String CART_PREFIX = "cart:";
    String ORDER_NO_LOCK = "order:lock:";
    int TOKEN_EXPIRE = 7 * 24 * 3600; // Token 7天
}
