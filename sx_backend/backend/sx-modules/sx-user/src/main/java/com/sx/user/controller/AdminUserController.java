package com.sx.user.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.sx.common.result.PageResult;
import com.sx.common.result.R;
import com.sx.user.entity.User;
import com.sx.user.mapper.UserMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@Tag(name = "管理端-用户")
@RestController
@RequestMapping("/admin/v1/user")
public class AdminUserController {

    private final UserMapper userMapper;

    public AdminUserController(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Operation(summary = "用户列表")
    @GetMapping("/list")
    public R<PageResult<User>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize) {
        Page<User> result = userMapper.selectPage(
                new Page<>(page, pageSize),
                new LambdaQueryWrapper<User>().orderByDesc(User::getCreateTime));
        return R.ok(PageResult.of(result));
    }

    @Operation(summary = "用户详情")
    @GetMapping("/{id}")
    public R<User> detail(@PathVariable Long id) {
        return R.ok(userMapper.selectById(id));
    }

    @Operation(summary = "启用/禁用")
    @PutMapping("/{id}/status")
    public R<Void> toggleStatus(@PathVariable Long id, @RequestParam Integer status) {
        User user = new User();
        user.setId(id);
        user.setStatus(status);
        userMapper.updateById(user);
        return R.ok();
    }
}
