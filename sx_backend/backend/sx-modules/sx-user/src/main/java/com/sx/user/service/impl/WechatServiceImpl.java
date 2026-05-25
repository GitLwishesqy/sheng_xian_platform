package com.sx.user.service.impl;

import com.sx.user.service.WechatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class WechatServiceImpl implements WechatService {

    private static final Logger log = LoggerFactory.getLogger(WechatServiceImpl.class);

    // TODO: 替换为实际的微信小程序 AppID 和 AppSecret
    private static final String WX_APPID = "";
    private static final String WX_SECRET = "";

    @Override
    public String getOpenidByCode(String code) {
        if (WX_APPID.isEmpty() || WX_SECRET.isEmpty()) {
            // 开发环境：使用code作为模拟openid
            log.info("【开发模式】微信登录未配置AppID/Secret，使用code生成模拟openid: {}", code);
            return "wx_dev_" + code.hashCode();
        }

        // 生产环境：调用微信API换取openid
        // String url = "https://api.weixin.qq.com/sns/jscode2session?appid=" + WX_APPID
        //         + "&secret=" + WX_SECRET + "&js_code=" + code + "&grant_type=authorization_code";
        // 发送HTTP请求，解析JSON，返回openid
        return null;
    }
}
