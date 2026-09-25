package com.cycleshop.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardStatsResponse {

    private long totalProducts;
    private long totalStock;
    private long todaySalesCount;
    private BigDecimal todayRevenue;
    private long lowStockCount;
    private List<ProductDto> lowStockProducts;
    private List<TopProductResponse> topSellingProducts;
    private List<SaleResponse> recentSales;

    public DashboardStatsResponse() {
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getTotalStock() {
        return totalStock;
    }

    public void setTotalStock(long totalStock) {
        this.totalStock = totalStock;
    }

    public long getTodaySalesCount() {
        return todaySalesCount;
    }

    public void setTodaySalesCount(long todaySalesCount) {
        this.todaySalesCount = todaySalesCount;
    }

    public BigDecimal getTodayRevenue() {
        return todayRevenue;
    }

    public void setTodayRevenue(BigDecimal todayRevenue) {
        this.todayRevenue = todayRevenue;
    }

    public long getLowStockCount() {
        return lowStockCount;
    }

    public void setLowStockCount(long lowStockCount) {
        this.lowStockCount = lowStockCount;
    }

    public List<ProductDto> getLowStockProducts() {
        return lowStockProducts;
    }

    public void setLowStockProducts(List<ProductDto> lowStockProducts) {
        this.lowStockProducts = lowStockProducts;
    }

    public List<TopProductResponse> getTopSellingProducts() {
        return topSellingProducts;
    }

    public void setTopSellingProducts(List<TopProductResponse> topSellingProducts) {
        this.topSellingProducts = topSellingProducts;
    }

    public List<SaleResponse> getRecentSales() {
        return recentSales;
    }

    public void setRecentSales(List<SaleResponse> recentSales) {
        this.recentSales = recentSales;
    }
}
