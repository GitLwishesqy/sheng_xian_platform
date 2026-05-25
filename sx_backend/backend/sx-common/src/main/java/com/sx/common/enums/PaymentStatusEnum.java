package com.sx.common.enums;

public enum PaymentStatusEnum {
    UNPAID(0, "未支付"),
    PAID(1, "已支付"),
    REFUNDED(2, "已退款");

    private final int code;
    private final String desc;

    PaymentStatusEnum(int code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public int getCode() { return code; }
    public String getDesc() { return desc; }
}
