package com.sx.product.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.sx.product.entity.Product;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface ProductMapper extends BaseMapper<Product> {

    @Update("UPDATE product SET stock = stock + #{delta}, sales = sales + #{salesDelta} WHERE id = #{id} AND stock + #{delta} >= 0")
    int updateStockAtomic(@Param("id") Long id, @Param("delta") int delta, @Param("salesDelta") int salesDelta);

    @Update("UPDATE product SET stock = stock + #{delta} WHERE id = #{id} AND stock + #{delta} >= 0")
    int deductStock(@Param("id") Long id, @Param("delta") int delta);
}
