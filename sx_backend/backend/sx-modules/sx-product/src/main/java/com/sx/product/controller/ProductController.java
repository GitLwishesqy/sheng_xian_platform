package com.sx.product.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.sx.common.result.PageResult;
import com.sx.common.result.R;
import com.sx.product.entity.Product;
import com.sx.product.entity.ProductSku;
import com.sx.product.entity.ProductVO;
import com.sx.product.mapper.ProductSkuMapper;
import com.sx.product.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "商品管理")
@RestController
@RequestMapping("/api/v1/product")
public class ProductController {

    private final ProductService productService;
    private final ProductSkuMapper skuMapper;

    public ProductController(ProductService productService, ProductSkuMapper skuMapper) {
        this.productService = productService;
        this.skuMapper = skuMapper;
    }

    @Operation(summary = "商品列表")
    @GetMapping("/list")
    public R<PageResult<Product>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) Long categoryId) {
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<Product>()
                .eq(Product::getStatus, 1)
                .eq(categoryId != null, Product::getCategoryId, categoryId)
                .orderByDesc(Product::getSort)
                .orderByDesc(Product::getSales);
        Page<Product> result = productService.page(new Page<>(page, pageSize), wrapper);
        return R.ok(PageResult.of(result));
    }

    @Operation(summary = "商品搜索")
    @GetMapping("/search")
    public R<PageResult<Product>> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize) {
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<Product>()
                .eq(Product::getStatus, 1)
                .and(w -> w.like(Product::getName, keyword)
                          .or().like(Product::getSubtitle, keyword))
                .orderByDesc(Product::getSales);
        Page<Product> result = productService.page(new Page<>(page, pageSize), wrapper);
        return R.ok(PageResult.of(result));
    }

    @Operation(summary = "商品详情(含SKU)")
    @GetMapping("/{id}")
    public R<ProductVO> detail(@PathVariable Long id) {
        Product product = productService.getById(id);
        if (product == null) {
            return R.fail(404, "商品不存在");
        }
        List<ProductSku> skus = skuMapper.selectList(
                new LambdaQueryWrapper<ProductSku>().eq(ProductSku::getProductId, id));
        return R.ok(ProductVO.from(product, skus));
    }
}
