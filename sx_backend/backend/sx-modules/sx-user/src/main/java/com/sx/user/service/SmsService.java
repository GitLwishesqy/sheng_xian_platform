package com.sx.user.service;

public interface SmsService {

    /**
     * 发送短信验证码
     * @param phone 手机号
     * @return 验证码（开发环境返回，生产环境通过短信发送）
     */
    String sendCode(String phone);

    /**
     * 验证短信验证码
     * @param phone 手机号
     * @param code 验证码
     * @return 是否验证通过
     */
    boolean verifyCode(String phone, String code);
}
