package com.sx.system.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.sx.system.entity.SysUser;

public interface SysUserService extends IService<SysUser> {

    /**
     * 根据用户名查询
     */
    SysUser getByUsername(String username);

    /**
     * 登录验证，成功返回用户，失败返回null
     */
    SysUser login(String username, String password);
}
