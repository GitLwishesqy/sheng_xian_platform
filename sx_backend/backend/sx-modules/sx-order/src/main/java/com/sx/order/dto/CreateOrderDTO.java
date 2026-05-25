package com.sx.order.dto;

import java.math.BigDecimal;
import java.util.List;

public class CreateOrderDTO {
    private Integer deliveryType;
    private Long addressId;
    private Long pickupPointId;
    private String remark;
    private List<OrderItemDTO> items;

    public static class OrderItemDTO {
        private Long productId;
        private Long skuId;
        private Integer quantity;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public Long getSkuId() { return skuId; }
        public void setSkuId(Long skuId) { this.skuId = skuId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    public Integer getDeliveryType() { return deliveryType; }
    public void setDeliveryType(Integer deliveryType) { this.deliveryType = deliveryType; }
    public Long getAddressId() { return addressId; }
    public void setAddressId(Long addressId) { this.addressId = addressId; }
    public Long getPickupPointId() { return pickupPointId; }
    public void setPickupPointId(Long pickupPointId) { this.pickupPointId = pickupPointId; }
    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
    public List<OrderItemDTO> getItems() { return items; }
    public void setItems(List<OrderItemDTO> items) { this.items = items; }
}
