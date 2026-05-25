package com.sx.common.result;

public enum ResultCode {
    SUCCESS(200, "操作成功"),
    BAD_REQUEST(400, "参数错误"),
    UNAUTHORIZED(401, "未登录或Token已过期"),
    FORBIDDEN(403, "无权限访问"),
    NOT_FOUND(404, "资源不存在"),
    METHOD_NOT_ALLOWED(405, "请求方法不支持"),
    CONFLICT(409, "数据冲突"),
    SERVER_ERROR(500, "服务器内部错误"),

    // 业务错误码 (10000+)
    USER_NOT_EXIST(10001, "用户不存在"),
    USER_DISABLED(10002, "用户已被禁用"),
    PRODUCT_NOT_EXIST(10003, "商品不存在"),
    PRODUCT_OFF_SHELF(10004, "商品已下架"),
    STOCK_INSUFFICIENT(10005, "库存不足"),
    ORDER_NOT_EXIST(10006, "订单不存在"),
    ORDER_STATUS_ERROR(10007, "订单状态不允许此操作"),
    COUPON_EXPIRED(10008, "优惠券已过期"),
    COUPON_RECEIVED(10009, "优惠券已领取"),
    PAYMENT_FAILED(10010, "支付失败"),
    ;

    private final int code;
    private final String message;

    ResultCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() { return code; }
    public String getMessage() { return message; }
}
