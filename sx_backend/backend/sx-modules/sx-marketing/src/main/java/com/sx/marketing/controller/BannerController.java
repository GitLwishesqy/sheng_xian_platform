package com.sx.marketing.controller;

import com.sx.common.result.R;
import com.sx.marketing.entity.Banner;
import com.sx.marketing.service.BannerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "首页-Banner")
@RestController
@RequestMapping("/api/v1")
public class BannerController {

    private final BannerService bannerService;

    public BannerController(BannerService bannerService) {
        this.bannerService = bannerService;
    }

    @Operation(summary = "轮播图列表")
    @GetMapping("/banner/list")
    public R<List<Banner>> bannerList() {
        return R.ok(bannerService.listEnabled());
    }
}
