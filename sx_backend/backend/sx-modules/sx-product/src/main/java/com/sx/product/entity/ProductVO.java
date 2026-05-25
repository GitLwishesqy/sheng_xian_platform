package com.sx.product.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ProductVO {
    private Long id;
    private Long categoryId;
    private String name;
    private String subtitle;
    private String coverImage;
    private List<String> images;
    private String detail;
    private String unit;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer stock;
    private Integer sales;
    private BigDecimal weight;
    private Integer shelfLife;
    private String storageCondition;
    private Integer sort;
    private Integer status;
    private LocalDateTime createTime;
    private List<ProductSku> skuList;

    public static ProductVO from(Product p, List<ProductSku> skus) {
        ProductVO vo = new ProductVO();
        vo.id = p.getId();
        vo.categoryId = p.getCategoryId();
        vo.name = p.getName();
        vo.subtitle = p.getSubtitle();
        vo.coverImage = p.getCoverImage();
        if (p.getImages() != null) {
            try { vo.images = com.alibaba.fastjson2.JSON.parseArray(p.getImages(), String.class); }
            catch (Exception e) { vo.images = java.util.Collections.emptyList(); }
        }
        vo.detail = p.getDetail();
        vo.unit = p.getUnit();
        vo.price = p.getPrice();
        vo.originalPrice = p.getOriginalPrice();
        vo.stock = p.getStock();
        vo.sales = p.getSales();
        vo.weight = p.getWeight();
        vo.shelfLife = p.getShelfLife();
        vo.storageCondition = p.getStorageCondition();
        vo.sort = p.getSort();
        vo.status = p.getStatus();
        vo.createTime = p.getCreateTime();
        vo.skuList = skus;
        return vo;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCategoryId() { return categoryId; }
    public String getName() { return name; }
    public String getSubtitle() { return subtitle; }
    public String getCoverImage() { return coverImage; }
    public List<String> getImages() { return images; }
    public String getDetail() { return detail; }
    public String getUnit() { return unit; }
    public BigDecimal getPrice() { return price; }
    public BigDecimal getOriginalPrice() { return originalPrice; }
    public Integer getStock() { return stock; }
    public Integer getSales() { return sales; }
    public BigDecimal getWeight() { return weight; }
    public Integer getShelfLife() { return shelfLife; }
    public String getStorageCondition() { return storageCondition; }
    public Integer getSort() { return sort; }
    public Integer getStatus() { return status; }
    public LocalDateTime getCreateTime() { return createTime; }
    public List<ProductSku> getSkuList() { return skuList; }
}
