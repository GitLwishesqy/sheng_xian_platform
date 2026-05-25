package com.sx.product.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.sx.common.result.R;
import com.sx.product.entity.Category;
import com.sx.product.mapper.CategoryMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@Tag(name = "管理端-分类")
@RestController
@RequestMapping("/admin/v1/category")
public class AdminCategoryController {

    private final CategoryMapper categoryMapper;

    public AdminCategoryController(CategoryMapper categoryMapper) {
        this.categoryMapper = categoryMapper;
    }

    @Operation(summary = "新增分类")
    @PostMapping
    public R<Void> add(@RequestBody Category category) {
        if (category.getStatus() == null) category.setStatus(1);
        categoryMapper.insert(category);
        return R.ok();
    }

    @Operation(summary = "修改分类")
    @PutMapping("/{id}")
    public R<Void> update(@PathVariable Long id, @RequestBody Category category) {
        category.setId(id);
        categoryMapper.updateById(category);
        return R.ok();
    }

    @Operation(summary = "删除分类")
    @DeleteMapping("/{id}")
    public R<Void> delete(@PathVariable Long id) {
        // 同时删除子分类
        categoryMapper.delete(new LambdaQueryWrapper<Category>().eq(Category::getParentId, id));
        categoryMapper.deleteById(id);
        return R.ok();
    }
}
