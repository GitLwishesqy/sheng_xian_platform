package com.sx.product.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.sx.product.entity.ProductSku;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface ProductSkuMapper extends BaseMapper<ProductSku> {

    @Update("UPDATE product_sku SET stock = stock + #{delta} WHERE id = #{id} AND stock + #{delta} >= 0")
    int deductStock(@Param("id") Long id, @Param("delta") int delta);
}
