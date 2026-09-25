package com.cycleshop.controller;

import com.cycleshop.dto.TopProductResponse;
import com.cycleshop.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/top-products")
    public ResponseEntity<List<TopProductResponse>> getTopProducts(
            @RequestParam(value = "period", defaultValue = "monthly") String period,
            @RequestParam(value = "limit", defaultValue = "5") int limit) {
        List<TopProductResponse> topProducts = analyticsService.getTopSellingProducts(period, limit);
        return ResponseEntity.ok(topProducts);
    }
}
