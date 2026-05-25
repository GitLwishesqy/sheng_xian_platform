package com.sx.marketing.controller;

import com.sx.common.result.R;
import com.sx.marketing.entity.Banner;
import com.sx.marketing.service.BannerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@Tag(name = "管理端-Banner")
@RestController
@RequestMapping("/admin/v1/banner")
public class AdminBannerController {

    private final BannerService bannerService;

    public AdminBannerController(BannerService bannerService) {
        this.bannerService = bannerService;
    }

    @Operation(summary = "新增Banner")
    @PostMapping
    public R<Void> add(@RequestBody Banner banner) {
        if (banner.getStatus() == null) banner.setStatus(1);
        bannerService.save(banner);
        return R.ok();
    }

    @Operation(summary = "编辑Banner")
    @PutMapping("/{id}")
    public R<Void> update(@PathVariable Long id, @RequestBody Banner banner) {
        banner.setId(id);
        bannerService.updateById(banner);
        return R.ok();
    }

    @Operation(summary = "删除Banner")
    @DeleteMapping("/{id}")
    public R<Void> delete(@PathVariable Long id) {
        bannerService.removeById(id);
        return R.ok();
    }
}
