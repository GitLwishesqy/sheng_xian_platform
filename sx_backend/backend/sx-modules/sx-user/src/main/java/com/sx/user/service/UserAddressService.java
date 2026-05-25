package com.sx.user.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.sx.user.entity.UserAddress;

import java.util.List;

public interface UserAddressService extends IService<UserAddress> {
    List<UserAddress> listByUserId(Long userId);
    void setDefault(Long id, Long userId);
}
