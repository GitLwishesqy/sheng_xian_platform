package com.sx.common.enums;

public enum OrderStatusEnum {
    PENDING_PAY(1, "待付款"),
    PENDING_DELIVERY(2, "待发货/待备货"),
    SHIPPED(3, "已发货/待取货"),
    RECEIVED(4, "已签收/已取货"),
    COMPLETED(5, "已完成"),
    CANCELLED(6, "已取消"),
    REFUNDING(7, "退款中"),
    REFUNDED(8, "已退款");

    private final int code;
    private final String desc;

    OrderStatusEnum(int code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public int getCode() { return code; }
    public String getDesc() { return desc; }

    public static OrderStatusEnum of(int code) {
        for (OrderStatusEnum e : values()) {
            if (e.code == code) return e;
        }
        return null;
    }
}
