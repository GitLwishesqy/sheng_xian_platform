package com.sx.system.controller;

import com.sx.common.result.R;
import com.sx.framework.annotation.RateLimit;
import com.sx.framework.security.JwtTokenProvider;
import com.sx.system.entity.SysUser;
import com.sx.system.service.SysUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Tag(name = "系统登录")
@RestController
@RequestMapping("/admin/v1/sys")
public class SysLoginController {

    private final SysUserService sysUserService;
    private final JwtTokenProvider jwtTokenProvider;

    public SysLoginController(SysUserService sysUserService, JwtTokenProvider jwtTokenProvider) {
        this.sysUserService = sysUserService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Operation(summary = "后台登录")
    @PostMapping("/login")
    @RateLimit(key = "rate:sys:login", window = 60, maxRequests = 5, perIp = true, message = "登录尝试过于频繁，请稍后再试")
    public R<Map<String, String>> login(@RequestParam String username, @RequestParam String password) {
        SysUser user = sysUserService.login(username, password);
        if (user == null) {
            return R.fail(401, "用户名或密码错误");
        }
        String token = jwtTokenProvider.generateToken(user.getId());
        Map<String, String> data = new HashMap<>();
        data.put("token", token);
        data.put("nickname", user.getNickname());
        return R.ok(data);
    }
}
