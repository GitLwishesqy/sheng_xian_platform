package com.sx.user.controller;

import com.sx.common.result.R;
import com.sx.framework.security.UserContext;
import com.sx.user.entity.User;
import com.sx.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@Tag(name = "用户管理")
@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "获取当前用户信息")
    @GetMapping("/info")
    public R<User> getInfo() {
        Long userId = UserContext.getUserId();
        User user = userService.getById(userId);
        return R.ok(user);
    }

    @Operation(summary = "修改用户信息")
    @PutMapping("/info")
    public R<Void> updateInfo(@RequestBody User user) {
        Long userId = UserContext.getUserId();
        user.setId(userId);
        userService.updateById(user);
        return R.ok();
    }
}
