package com.sx.product.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.sx.common.result.PageResult;
import com.sx.common.result.R;
import com.sx.product.entity.Product;
import com.sx.product.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@Tag(name = "首页")
@RestController
@RequestMapping("/api/v1/home")
public class HomeController {

    private final ProductService productService;

    public HomeController(ProductService productService) {
        this.productService = productService;
    }

    @Operation(summary = "首页推荐商品")
    @GetMapping("/recommend")
    public R<PageResult<Product>> recommend(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize) {
        Page<Product> result = productService.page(new Page<>(page, pageSize),
                new LambdaQueryWrapper<Product>()
                        .eq(Product::getStatus, 1)
                        .orderByDesc(Product::getSales)
                        .orderByDesc(Product::getSort));
        return R.ok(PageResult.of(result));
    }
}
