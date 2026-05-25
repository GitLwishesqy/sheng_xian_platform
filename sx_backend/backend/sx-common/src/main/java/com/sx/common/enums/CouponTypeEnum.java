package com.sx.common.enums;

public enum CouponTypeEnum {
    FULL_REDUCTION(1, "满减券"),
    DISCOUNT(2, "折扣券"),
    CASH(3, "现金券");

    private final int code;
    private final String desc;

    CouponTypeEnum(int code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public int getCode() { return code; }
    public String getDesc() { return desc; }
}
