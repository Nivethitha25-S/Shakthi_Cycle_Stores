package com.cycleshop.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.cycleshop.dto.DashboardStatsResponse;
import com.cycleshop.dto.ProductDto;
import com.cycleshop.dto.SaleResponse;
import com.cycleshop.dto.TopProductResponse;
import com.cycleshop.repository.ProductRepository;
import com.cycleshop.repository.SaleRepository;

@Service
public class DashboardService {

    private final ProductRepository productRepository;
    private final SaleRepository saleRepository;
    private final ProductService productService;
    private final SaleService saleService;
    private final AnalyticsService analyticsService;

    public DashboardService(ProductRepository productRepository,
                            SaleRepository saleRepository,
                            ProductService productService,
                            SaleService saleService,
                            AnalyticsService analyticsService) {
        this.productRepository = productRepository;
        this.saleRepository = saleRepository;
        this.productService = productService;
        this.saleService = saleService;
        this.analyticsService = analyticsService;
    }

    public DashboardStatsResponse getDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();

        stats.setTotalProducts(productRepository.count());
        stats.setTotalStock(productRepository.sumTotalStock());

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDateTime.now();

        stats.setTodaySalesCount(saleRepository.countSalesBetween(startOfDay, endOfDay));
        BigDecimal todayRevenue = saleRepository.sumRevenueBetween(startOfDay, endOfDay);
        stats.setTodayRevenue(todayRevenue != null ? todayRevenue : BigDecimal.ZERO);

        List<ProductDto> lowStockList = productService.getLowStockProducts();
        stats.setLowStockCount(lowStockList.size());
        stats.setLowStockProducts(lowStockList);

        List<TopProductResponse> topSelling = analyticsService.getTopSellingProducts("monthly", 5);
        stats.setTopSellingProducts(topSelling);

        List<SaleResponse> recentSales = saleRepository.findRecentSales(PageRequest.of(0, 5))
                .stream()
                .map(saleService::toResponse)
                .collect(Collectors.toList());
        stats.setRecentSales(recentSales);

        return stats;
    }
}
