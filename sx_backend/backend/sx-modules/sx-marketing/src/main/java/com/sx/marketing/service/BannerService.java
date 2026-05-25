package com.sx.marketing.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.sx.marketing.entity.Banner;

import java.util.List;

public interface BannerService extends IService<Banner> {

    /**
     * 获取启用的轮播图列表
     */
    List<Banner> listEnabled();
}
