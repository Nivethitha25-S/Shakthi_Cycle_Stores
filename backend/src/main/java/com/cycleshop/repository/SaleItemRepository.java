package com.cycleshop.repository;

import com.cycleshop.dto.TopProductResponse;
import com.cycleshop.entity.SaleItem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SaleItemRepository extends JpaRepository<SaleItem, Long> {

    List<SaleItem> findBySaleId(Long saleId);

    @Query("SELECT new com.cycleshop.dto.TopProductResponse(" +
           "p.id, p.productName, p.category, p.brand, SUM(si.quantity), SUM(si.totalPrice)) " +
           "FROM SaleItem si " +
           "JOIN si.sale s " +
           "JOIN si.product p " +
           "WHERE s.saleDate >= :startDate AND s.saleDate <= :endDate " +
           "GROUP BY p.id, p.productName, p.category, p.brand " +
           "ORDER BY SUM(si.quantity) DESC")
    List<TopProductResponse> findTopProductsBetween(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    @Query("SELECT new com.cycleshop.dto.TopProductResponse(" +
           "p.id, p.productName, p.category, p.brand, SUM(si.quantity), SUM(si.totalPrice)) " +
           "FROM SaleItem si " +
           "JOIN si.sale s " +
           "JOIN si.product p " +
           "GROUP BY p.id, p.productName, p.category, p.brand " +
           "ORDER BY SUM(si.quantity) DESC")
    List<TopProductResponse> findAllTimeTopProducts(Pageable pageable);
}
