package com.sx.user.service;

public interface WechatService {

    /**
     * 通过微信小程序code获取openid
     * @param code 微信登录凭证
     * @return openid，失败返回null
     */
    String getOpenidByCode(String code);
}
