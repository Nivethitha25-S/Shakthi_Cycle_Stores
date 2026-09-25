package com.cycleshop.dto;

import java.math.BigDecimal;

public class TopProductResponse {

    private Long productId;
    private String productName;
    private String category;
    private String brand;
    private Long quantitySold;
    private BigDecimal totalRevenue;

    public TopProductResponse() {
    }

    public TopProductResponse(Long productId, String productName, String category,
                              String brand, Long quantitySold, BigDecimal totalRevenue) {
        this.productId = productId;
        this.productName = productName;
        this.category = category;
        this.brand = brand;
        this.quantitySold = quantitySold;
        this.totalRevenue = totalRevenue;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public Long getQuantitySold() {
        return quantitySold;
    }

    public void setQuantitySold(Long quantitySold) {
        this.quantitySold = quantitySold;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}
