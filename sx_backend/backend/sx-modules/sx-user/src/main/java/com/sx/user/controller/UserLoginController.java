package com.sx.user.controller;

import com.sx.common.result.R;
import com.sx.framework.security.JwtTokenProvider;
import com.sx.user.entity.User;
import com.sx.user.service.SmsService;
import com.sx.user.service.UserService;
import com.sx.user.service.WechatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Tag(name = "用户登录")
@RestController
@RequestMapping("/api/v1/user/login")
public class UserLoginController {

    private final UserService userService;
    private final SmsService smsService;
    private final WechatService wechatService;
    private final JwtTokenProvider jwtTokenProvider;

    public UserLoginController(UserService userService, SmsService smsService,
                               WechatService wechatService, JwtTokenProvider jwtTokenProvider) {
        this.userService = userService;
        this.smsService = smsService;
        this.wechatService = wechatService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Operation(summary = "发送短信验证码")
    @PostMapping("/sms/send")
    public R<Map<String, String>> sendSms(@RequestBody Map<String, String> body) {
        String phone = body.get("phone");
        if (phone == null || phone.length() != 11) {
            return R.fail(400, "请输入正确的手机号");
        }

        String code = smsService.sendCode(phone);
        if (code == null) {
            return R.fail(400, "验证码已发送，请60秒后再试");
        }

        // 开发环境返回验证码（生产环境去掉data字段）
        Map<String, String> data = new HashMap<>();
        data.put("code", code);
        return R.ok("验证码已发送", data);
    }

    @Operation(summary = "手机号+验证码登录")
    @PostMapping("/phone")
    public R<Map<String, String>> loginByPhone(@RequestBody Map<String, String> body) {
        String phone = body.get("phone");
        String code = body.get("code");

        if (phone == null || code == null) {
            return R.fail(400, "手机号和验证码不能为空");
        }

        if (!smsService.verifyCode(phone, code)) {
            return R.fail(400, "验证码错误或已过期");
        }

        // 查找或创建用户
        User user = userService.getByPhone(phone);
        if (user == null) {
            user = new User();
            user.setPhone(phone);
            user.setNickname("用户" + phone.substring(7));
            user.setStatus(1);
            user.setLastLoginTime(LocalDateTime.now());
            userService.save(user);
        } else {
            user.setLastLoginTime(LocalDateTime.now());
            userService.updateById(user);
        }

        String token = jwtTokenProvider.generateToken(user.getId());
        Map<String, String> data = new HashMap<>();
        data.put("token", token);
        data.put("nickname", user.getNickname());
        return R.ok(data);
    }

    @Operation(summary = "微信小程序登录")
    @PostMapping("/wechat")
    public R<Map<String, String>> loginByWechat(@RequestBody Map<String, String> body) {
        String code = body.get("code");
        if (code == null) {
            return R.fail(400, "微信授权失败");
        }

        String openid = wechatService.getOpenidByCode(code);
        if (openid == null) {
            return R.fail(400, "微信登录失败");
        }

        // 查找或创建用户
        User user = userService.getByOpenid(openid);
        if (user == null) {
            user = new User();
            user.setOpenid(openid);
            user.setNickname("微信用户");
            user.setStatus(1);
            user.setLastLoginTime(LocalDateTime.now());
            userService.save(user);
        } else {
            user.setLastLoginTime(LocalDateTime.now());
            userService.updateById(user);
        }

        String token = jwtTokenProvider.generateToken(user.getId());
        Map<String, String> data = new HashMap<>();
        data.put("token", token);
        data.put("nickname", user.getNickname());
        return R.ok(data);
    }
}
