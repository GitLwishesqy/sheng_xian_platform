package com.sx.cart.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.sx.cart.entity.CartItem;
import com.sx.cart.entity.CartItemVO;
import com.sx.cart.service.CartItemService;
import com.sx.common.result.R;
import com.sx.framework.security.UserContext;
import com.sx.product.entity.Product;
import com.sx.product.entity.ProductSku;
import com.sx.product.mapper.ProductMapper;
import com.sx.product.mapper.ProductSkuMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Tag(name = "购物车")
@RestController
@RequestMapping("/api/v1/cart")
public class CartController {

    private final CartItemService cartService;
    private final ProductMapper productMapper;
    private final ProductSkuMapper skuMapper;

    public CartController(CartItemService cartService, ProductMapper productMapper, ProductSkuMapper skuMapper) {
        this.cartService = cartService;
        this.productMapper = productMapper;
        this.skuMapper = skuMapper;
    }

    @Operation(summary = "购物车列表(含商品详情)")
    @GetMapping("/list")
    public R<List<CartItemVO>> list() {
        Long userId = UserContext.getUserId();
        List<CartItem> items = cartService.list(new LambdaQueryWrapper<CartItem>()
                .eq(CartItem::getUserId, userId)
                .orderByDesc(CartItem::getCreateTime));

        List<Long> productIds = items.stream().map(CartItem::getProductId).distinct().collect(Collectors.toList());
        List<Long> skuIds = items.stream().map(CartItem::getSkuId).filter(id -> id != null).distinct().collect(Collectors.toList());

        Map<Long, Product> productMap = productIds.isEmpty() ? java.util.Collections.emptyMap() :
                productMapper.selectBatchIds(productIds).stream().collect(Collectors.toMap(Product::getId, p -> p));
        Map<Long, ProductSku> skuMap = skuIds.isEmpty() ? java.util.Collections.emptyMap() :
                skuMapper.selectBatchIds(skuIds).stream().collect(Collectors.toMap(ProductSku::getId, s -> s));

        List<CartItemVO> vos = new ArrayList<>();
        for (CartItem item : items) {
            CartItemVO vo = new CartItemVO();
            vo.setId(item.getId());
            vo.setUserId(item.getUserId());
            vo.setProductId(item.getProductId());
            vo.setSkuId(item.getSkuId());
            vo.setQuantity(item.getQuantity());
            vo.setSelected(item.getSelected());
            vo.setCreateTime(item.getCreateTime());
            vo.setUpdateTime(item.getUpdateTime());

            Product p = productMap.get(item.getProductId());
            if (p != null) {
                vo.setProductName(p.getName());
                vo.setProductImage(p.getCoverImage());
                vo.setPrice(p.getPrice());
            }
            if (item.getSkuId() != null) {
                ProductSku sku = skuMap.get(item.getSkuId());
                if (sku != null) {
                    vo.setPrice(sku.getPrice());
                    String spec = "";
                    if (sku.getSpecName() != null) spec += sku.getSpecName();
                    if (sku.getSpecValue() != null) spec += " " + sku.getSpecValue();
                    vo.setSpecInfo(spec.trim());
                }
            }
            vos.add(vo);
        }
        return R.ok(vos);
    }

    @Operation(summary = "添加到购物车")
    @PostMapping
    public R<Void> add(@RequestBody CartItem item) {
        item.setUserId(UserContext.getUserId());
        if (item.getQuantity() == null) item.setQuantity(1);
        if (item.getSelected() == null) item.setSelected(1);
        CartItem exist = cartService.getOne(new LambdaQueryWrapper<CartItem>()
                .eq(CartItem::getUserId, item.getUserId())
                .eq(CartItem::getProductId, item.getProductId())
                .eq(item.getSkuId() != null, CartItem::getSkuId, item.getSkuId()));
        if (exist != null) {
            exist.setQuantity(exist.getQuantity() + item.getQuantity());
            cartService.updateById(exist);
        } else {
            cartService.save(item);
        }
        return R.ok();
    }

    @Operation(summary = "修改数量")
    @PutMapping("/{id}")
    public R<Void> updateQuantity(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        CartItem item = new CartItem();
        item.setId(id);
        item.setQuantity(body.get("quantity"));
        cartService.updateById(item);
        return R.ok();
    }

    @Operation(summary = "选中/取消")
    @PutMapping("/{id}/select")
    public R<Void> toggleSelect(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        CartItem item = new CartItem();
        item.setId(id);
        item.setSelected(body.get("selected"));
        cartService.updateById(item);
        return R.ok();
    }

    @Operation(summary = "全选/取消全选")
    @PutMapping("/select-all")
    public R<Void> selectAll(@RequestBody Map<String, Integer> body) {
        int selected = body.get("selected");
        CartItem update = new CartItem();
        update.setSelected(selected);
        cartService.update(update, new LambdaQueryWrapper<CartItem>().eq(CartItem::getUserId, UserContext.getUserId()));
        return R.ok();
    }

    @Operation(summary = "删除")
    @DeleteMapping("/{id}")
    public R<Void> delete(@PathVariable Long id) {
        cartService.removeById(id);
        return R.ok();
    }

    @Operation(summary = "清空")
    @DeleteMapping("/clear")
    public R<Void> clear() {
        cartService.remove(new LambdaQueryWrapper<CartItem>().eq(CartItem::getUserId, UserContext.getUserId()));
        return R.ok();
    }
}
