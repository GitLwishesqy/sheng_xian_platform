package com.sx.product.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.sx.common.result.PageResult;
import com.sx.common.result.R;
import com.sx.product.entity.Product;
import com.sx.product.entity.ProductSku;
import com.sx.product.mapper.ProductSkuMapper;
import com.sx.product.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "管理端-商品")
@RestController
@RequestMapping("/admin/v1/product")
public class AdminProductController {

    private final ProductService productService;
    private final ProductSkuMapper skuMapper;

    public AdminProductController(ProductService productService, ProductSkuMapper skuMapper) {
        this.productService = productService;
        this.skuMapper = skuMapper;
    }

    @Operation(summary = "商品列表")
    @GetMapping("/list")
    public R<PageResult<Product>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword) {
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<Product>()
                .eq(categoryId != null, Product::getCategoryId, categoryId)
                .and(keyword != null && !keyword.isEmpty(),
                        w -> w.like(Product::getName, keyword).or().like(Product::getSubtitle, keyword))
                .orderByDesc(Product::getCreateTime);
        Page<Product> result = productService.page(new Page<>(page, pageSize), wrapper);
        return R.ok(PageResult.of(result));
    }

    @Operation(summary = "新增商品")
    @PostMapping
    public R<Product> add(@RequestBody Product product) {
        product.setStatus(1);
        productService.save(product);
        return R.ok(product);
    }

    @Operation(summary = "编辑商品")
    @PutMapping("/{id}")
    public R<Void> update(@PathVariable Long id, @RequestBody Product product) {
        product.setId(id);
        productService.updateById(product);
        return R.ok();
    }

    @Operation(summary = "上下架")
    @PutMapping("/{id}/status")
    public R<Void> toggleStatus(@PathVariable Long id, @RequestParam Integer status) {
        Product product = new Product();
        product.setId(id);
        product.setStatus(status);
        productService.updateById(product);
        return R.ok();
    }

    @Operation(summary = "删除商品")
    @DeleteMapping("/{id}")
    public R<Void> delete(@PathVariable Long id) {
        productService.removeById(id);
        return R.ok();
    }

    @Operation(summary = "SKU列表")
    @GetMapping("/{productId}/sku")
    public R<List<ProductSku>> skuList(@PathVariable Long productId) {
        return R.ok(skuMapper.selectList(
                new LambdaQueryWrapper<ProductSku>().eq(ProductSku::getProductId, productId)));
    }

    @Operation(summary = "新增SKU")
    @PostMapping("/{productId}/sku")
    public R<Void> addSku(@PathVariable Long productId, @RequestBody ProductSku sku) {
        sku.setProductId(productId);
        skuMapper.insert(sku);
        return R.ok();
    }

    @Operation(summary = "修改SKU")
    @PutMapping("/sku/{id}")
    public R<Void> updateSku(@PathVariable Long id, @RequestBody ProductSku sku) {
        sku.setId(id);
        skuMapper.updateById(sku);
        return R.ok();
    }

    @Operation(summary = "删除SKU")
    @DeleteMapping("/sku/{id}")
    public R<Void> deleteSku(@PathVariable Long id) {
        skuMapper.deleteById(id);
        return R.ok();
    }
}
