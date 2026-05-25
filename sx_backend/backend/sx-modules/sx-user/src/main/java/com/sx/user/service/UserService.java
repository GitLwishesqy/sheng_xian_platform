package com.sx.user.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.sx.user.entity.User;

public interface UserService extends IService<User> {
    User getByOpenid(String openid);
    User getByPhone(String phone);
}
