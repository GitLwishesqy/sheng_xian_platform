package com.sx.product.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.sx.product.entity.Product;

public interface ProductService extends IService<Product> {
    void updateStock(Long productId, int delta);
    void increaseSales(Long productId, int delta);

    /**
     * 原子扣减库存并增加销量，返回受影响行数（0表示库存不足）
     */
    int deductStockAndIncreaseSales(Long productId, int quantity);

    /**
     * 恢复库存（取消订单时使用）
     */
    void restoreStock(Long productId, int quantity);
}
