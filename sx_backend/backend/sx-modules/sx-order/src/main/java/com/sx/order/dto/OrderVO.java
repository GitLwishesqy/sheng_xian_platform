package com.sx.order.dto;

import com.sx.order.entity.Order;
import com.sx.order.entity.OrderItem;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderVO {
    private Long id;
    private String orderNo;
    private Long userId;
    private Integer deliveryType;
    private Long addressId;
    private Long pickupPointId;
    private String addressSnapshot;
    private BigDecimal totalAmount;
    private BigDecimal deliveryFee;
    private BigDecimal discountAmount;
    private BigDecimal payAmount;
    private Integer orderStatus;
    private Integer paymentStatus;
    private Integer paymentMethod;
    private LocalDateTime paymentTime;
    private LocalDateTime deliveryTime;
    private LocalDateTime receiveTime;
    private LocalDateTime completeTime;
    private LocalDateTime cancelTime;
    private String remark;
    private LocalDateTime createTime;
    private List<OrderItem> items;

    public static OrderVO from(Order order, List<OrderItem> items) {
        OrderVO vo = new OrderVO();
        vo.id = order.getId();
        vo.orderNo = order.getOrderNo();
        vo.userId = order.getUserId();
        vo.deliveryType = order.getDeliveryType();
        vo.addressId = order.getAddressId();
        vo.pickupPointId = order.getPickupPointId();
        vo.addressSnapshot = order.getAddressSnapshot();
        vo.totalAmount = order.getTotalAmount();
        vo.deliveryFee = order.getDeliveryFee();
        vo.discountAmount = order.getDiscountAmount();
        vo.payAmount = order.getPayAmount();
        vo.orderStatus = order.getOrderStatus();
        vo.paymentStatus = order.getPaymentStatus();
        vo.paymentMethod = order.getPaymentMethod();
        vo.paymentTime = order.getPaymentTime();
        vo.deliveryTime = order.getDeliveryTime();
        vo.receiveTime = order.getReceiveTime();
        vo.completeTime = order.getCompleteTime();
        vo.cancelTime = order.getCancelTime();
        vo.remark = order.getRemark();
        vo.createTime = order.getCreateTime();
        vo.items = items;
        return vo;
    }

    public Long getId() { return id; }
    public String getOrderNo() { return orderNo; }
    public Long getUserId() { return userId; }
    public Integer getDeliveryType() { return deliveryType; }
    public Long getAddressId() { return addressId; }
    public Long getPickupPointId() { return pickupPointId; }
    public String getAddressSnapshot() { return addressSnapshot; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public BigDecimal getDeliveryFee() { return deliveryFee; }
    public BigDecimal getDiscountAmount() { return discountAmount; }
    public BigDecimal getPayAmount() { return payAmount; }
    public Integer getOrderStatus() { return orderStatus; }
    public Integer getPaymentStatus() { return paymentStatus; }
    public Integer getPaymentMethod() { return paymentMethod; }
    public LocalDateTime getPaymentTime() { return paymentTime; }
    public LocalDateTime getDeliveryTime() { return deliveryTime; }
    public LocalDateTime getReceiveTime() { return receiveTime; }
    public LocalDateTime getCompleteTime() { return completeTime; }
    public LocalDateTime getCancelTime() { return cancelTime; }
    public String getRemark() { return remark; }
    public LocalDateTime getCreateTime() { return createTime; }
    public List<OrderItem> getItems() { return items; }
}
