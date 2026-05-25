package com.sx.product.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.sx.product.entity.Product;
import com.sx.product.mapper.ProductMapper;
import com.sx.product.service.ProductService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductServiceImpl extends ServiceImpl<ProductMapper, Product> implements ProductService {

    @Override
    @Transactional
    public void updateStock(Long productId, int delta) {
        baseMapper.deductStock(productId, -delta);
    }

    @Override
    public void increaseSales(Long productId, int delta) {
        Product product = getById(productId);
        if (product != null) {
            product.setSales(product.getSales() + delta);
            updateById(product);
        }
    }

    @Override
    public int deductStockAndIncreaseSales(Long productId, int quantity) {
        return baseMapper.updateStockAtomic(productId, -quantity, quantity);
    }

    @Override
    public void restoreStock(Long productId, int quantity) {
        baseMapper.deductStock(productId, quantity);
    }
}
