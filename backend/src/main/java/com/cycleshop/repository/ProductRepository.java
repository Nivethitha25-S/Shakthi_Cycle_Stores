package com.cycleshop.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cycleshop.entity.Product;

import jakarta.persistence.LockModeType;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findByIdWithLock(@Param("id") Long id);

    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.productName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.category) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.brand) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.supplier) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchProducts(@Param("query") String query);

    @Query("SELECT p FROM Product p WHERE p.stockQuantity <= p.minimumStock ORDER BY p.stockQuantity ASC")
    List<Product> findLowStockProducts();

    @Query("SELECT COUNT(p) FROM Product p WHERE p.stockQuantity <= p.minimumStock")
    long countLowStockProducts();

    @Query("SELECT COALESCE(SUM(p.stockQuantity), 0) FROM Product p")
    long sumTotalStock();

    boolean existsByProductNameIgnoreCase(String productName);
}
