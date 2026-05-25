package com.sx.user.controller;

import com.sx.common.result.R;
import com.sx.framework.security.UserContext;
import com.sx.user.entity.UserAddress;
import com.sx.user.service.UserAddressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "收货地址")
@RestController
@RequestMapping("/api/v1/address")
public class UserAddressController {

    private final UserAddressService addressService;

    public UserAddressController(UserAddressService addressService) {
        this.addressService = addressService;
    }

    @Operation(summary = "地址列表")
    @GetMapping("/list")
    public R<List<UserAddress>> list() {
        return R.ok(addressService.listByUserId(UserContext.getUserId()));
    }

    @Operation(summary = "新增地址")
    @PostMapping
    public R<Void> add(@RequestBody UserAddress address) {
        address.setUserId(UserContext.getUserId());
        addressService.save(address);
        return R.ok();
    }

    @Operation(summary = "修改地址")
    @PutMapping("/{id}")
    public R<Void> update(@PathVariable Long id, @RequestBody UserAddress address) {
        address.setId(id);
        addressService.updateById(address);
        return R.ok();
    }

    @Operation(summary = "删除地址")
    @DeleteMapping("/{id}")
    public R<Void> delete(@PathVariable Long id) {
        addressService.removeById(id);
        return R.ok();
    }

    @Operation(summary = "设为默认")
    @PutMapping("/{id}/default")
    public R<Void> setDefault(@PathVariable Long id) {
        addressService.setDefault(id, UserContext.getUserId());
        return R.ok();
    }
}
