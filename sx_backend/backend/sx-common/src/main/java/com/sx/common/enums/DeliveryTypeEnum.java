package com.sx.common.enums;

public enum DeliveryTypeEnum {
    HOME_DELIVERY(1, "配送到家"),
    SELF_PICKUP(2, "到店自提");

    private final int code;
    private final String desc;

    DeliveryTypeEnum(int code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public int getCode() { return code; }
    public String getDesc() { return desc; }
}
