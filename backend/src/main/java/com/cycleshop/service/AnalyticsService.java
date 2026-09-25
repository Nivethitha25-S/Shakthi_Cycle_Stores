package com.cycleshop.service;

import com.cycleshop.dto.TopProductResponse;
import com.cycleshop.repository.SaleItemRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
public class AnalyticsService {

    private final SaleItemRepository saleItemRepository;

    public AnalyticsService(SaleItemRepository saleItemRepository) {
        this.saleItemRepository = saleItemRepository;
    }

    public List<TopProductResponse> getTopSellingProducts(String period, int limit) {
        if (limit <= 0) {
            limit = 5;
        }
        Pageable pageable = PageRequest.of(0, limit);
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startDate;

        if ("daily".equalsIgnoreCase(period)) {
            startDate = LocalDate.now().atStartOfDay();
        } else if ("weekly".equalsIgnoreCase(period)) {
            startDate = LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).atStartOfDay();
        } else if ("monthly".equalsIgnoreCase(period)) {
            startDate = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        } else if ("all".equalsIgnoreCase(period)) {
            return saleItemRepository.findAllTimeTopProducts(pageable);
        } else {
            startDate = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        }

        List<TopProductResponse> results = saleItemRepository.findTopProductsBetween(startDate, now, pageable);
        if (results.isEmpty() && !"daily".equalsIgnoreCase(period)) {
            return saleItemRepository.findAllTimeTopProducts(pageable);
        }

        return results;
    }
}
