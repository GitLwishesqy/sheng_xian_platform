package com.sx.cart.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.sx.cart.entity.CartItem;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CartItemMapper extends BaseMapper<CartItem> {
}
