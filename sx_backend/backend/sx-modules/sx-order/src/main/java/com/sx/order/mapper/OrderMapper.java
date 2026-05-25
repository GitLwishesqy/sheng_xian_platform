package com.sx.order.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.sx.order.entity.Order;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

import java.time.LocalDateTime;

@Mapper
public interface OrderMapper extends BaseMapper<Order> {

    /**
     * 原子更新订单状态（乐观锁：CAS on order_status）
     * @return 受影响行数，0表示状态已被其他线程修改
     */
    @Update("UPDATE `order` SET order_status = #{newStatus}, payment_status = #{paymentStatus}, " +
            "payment_method = #{paymentMethod}, payment_time = #{paymentTime}, update_time = NOW() " +
            "WHERE id = #{id} AND order_status = #{expectedStatus}")
    int updateOrderStatusAtomic(@Param("id") Long id,
                                 @Param("expectedStatus") Integer expectedStatus,
                                 @Param("newStatus") Integer newStatus,
                                 @Param("paymentStatus") Integer paymentStatus,
                                 @Param("paymentMethod") Integer paymentMethod,
                                 @Param("paymentTime") LocalDateTime paymentTime);

    /**
     * 原子取消订单（乐观锁：CAS on order_status = PENDING_PAY）
     */
    @Update("UPDATE `order` SET order_status = #{newStatus}, cancel_time = #{cancelTime}, update_time = NOW() " +
            "WHERE id = #{id} AND order_status = #{expectedStatus}")
    int cancelOrderAtomic(@Param("id") Long id,
                           @Param("expectedStatus") Integer expectedStatus,
                           @Param("newStatus") Integer newStatus,
                           @Param("cancelTime") LocalDateTime cancelTime);

    /**
     * 超时关单：批量取消过期未支付订单
     * @return 受影响行数
     */
    @Update("UPDATE `order` SET order_status = #{newStatus}, cancel_time = NOW(), update_time = NOW() " +
            "WHERE order_status = #{expectedStatus} AND create_time < #{expireTime}")
    int cancelTimeoutOrders(@Param("expectedStatus") Integer expectedStatus,
                             @Param("newStatus") Integer newStatus,
                             @Param("expireTime") LocalDateTime expireTime);

    /**
     * 原子更新订单状态（通用乐观锁）
     */
    @Update("UPDATE `order` SET order_status = #{newStatus}, update_time = NOW() " +
            "WHERE id = #{id} AND order_status = #{expectedStatus}")
    int updateStatusAtomic(@Param("id") Long id,
                            @Param("expectedStatus") Integer expectedStatus,
                            @Param("newStatus") Integer newStatus);
}
