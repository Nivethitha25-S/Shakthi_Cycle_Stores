package com.cycleshop.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cycleshop.dto.SaleItemRequest;
import com.cycleshop.dto.SaleItemResponse;
import com.cycleshop.dto.SaleRequest;
import com.cycleshop.dto.SaleResponse;
import com.cycleshop.entity.Product;
import com.cycleshop.entity.Sale;
import com.cycleshop.entity.SaleItem;
import com.cycleshop.exception.BadRequestException;
import com.cycleshop.exception.InsufficientStockException;
import com.cycleshop.exception.ResourceNotFoundException;
import com.cycleshop.repository.ProductRepository;
import com.cycleshop.repository.SaleItemRepository;
import com.cycleshop.repository.SaleRepository;

@Service
public class SaleService {

    private final SaleRepository saleRepository;
    private final SaleItemRepository saleItemRepository;
    private final ProductRepository productRepository;

    public SaleService(SaleRepository saleRepository,
                       SaleItemRepository saleItemRepository,
                       ProductRepository productRepository) {
        this.saleRepository = saleRepository;
        this.saleItemRepository = saleItemRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public SaleResponse createSale(SaleRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Sale must contain at least one item.");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        List<SaleItem> saleItemsToSave = new ArrayList<>();

        Sale sale = new Sale();
        sale.setInvoiceNumber(generateUniqueInvoiceNumber());
        sale.setCustomerName(request.getCustomerName().trim());
        sale.setCustomerPhone(request.getCustomerPhone() != null ? request.getCustomerPhone().trim() : null);
        sale.setPaymentMethod(request.getPaymentMethod().trim().toUpperCase());
        sale.setSaleDate(LocalDateTime.now());

        for (SaleItemRequest itemReq : request.getItems()) {
            if (itemReq.getQuantity() == null || itemReq.getQuantity() <= 0) {
                throw new BadRequestException("Requested quantity must be greater than zero.");
            }

            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemReq.getProductId()));

            int availableStock = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
            if (availableStock < itemReq.getQuantity()) {
                throw new InsufficientStockException(
                        "Insufficient stock for product '" + product.getProductName() +
                        "'. Available quantity: " + availableStock +
                        ", Requested quantity: " + itemReq.getQuantity()
                );
            }

            BigDecimal unitPrice = product.getSellingPrice();
            BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            subtotal = subtotal.add(itemTotal);

            product.setStockQuantity(availableStock - itemReq.getQuantity());
            productRepository.save(product);

            SaleItem saleItem = new SaleItem();
            saleItem.setSale(sale);
            saleItem.setProduct(product);
            saleItem.setQuantity(itemReq.getQuantity());
            saleItem.setUnitPrice(unitPrice);
            saleItem.setTotalPrice(itemTotal);
            saleItemsToSave.add(saleItem);
        }

        BigDecimal discount = request.getDiscount() != null ? request.getDiscount() : BigDecimal.ZERO;
        if (discount.compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("Discount cannot be negative.");
        }
        if (discount.compareTo(subtotal) > 0) {
            throw new BadRequestException("Discount (₹" + discount + ") cannot exceed subtotal (₹" + subtotal + ").");
        }

        BigDecimal finalTotal = subtotal.subtract(discount);

        sale.setSubtotal(subtotal);
        sale.setDiscount(discount);
        sale.setTotalAmount(finalTotal);

        for (SaleItem item : saleItemsToSave) {
            sale.addItem(item);
        }

        Sale savedSale = saleRepository.save(sale);
        return toResponse(savedSale);
    }

    public List<SaleResponse> getAllSales() {
        return saleRepository.findAllByOrderBySaleDateDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public SaleResponse getSaleById(Long id) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found with id: " + id));
        return toResponse(sale);
    }

    public SaleResponse getSaleByInvoiceNumber(String invoiceNumber) {
        Sale sale = saleRepository.findByInvoiceNumber(invoiceNumber.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found with invoice number: " + invoiceNumber));
        return toResponse(sale);
    }

    private String generateUniqueInvoiceNumber() {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String invoiceNumber;
        do {
            int randomSuffix = ThreadLocalRandom.current().nextInt(1000, 9999);
            invoiceNumber = "INV-" + datePart + "-" + randomSuffix;
        } while (saleRepository.findByInvoiceNumber(invoiceNumber).isPresent());
        return invoiceNumber;
    }

    public SaleResponse toResponse(Sale sale) {
        List<SaleItemResponse> items = sale.getItems().stream().map(item -> new SaleItemResponse(
                item.getId(),
                item.getProduct() != null ? item.getProduct().getId() : null,
                item.getProduct() != null ? item.getProduct().getProductName() : "Unknown Product",
                item.getProduct() != null ? item.getProduct().getCategory() : "",
                item.getProduct() != null ? item.getProduct().getBrand() : "",
                item.getQuantity(),
                item.getUnitPrice(),
                item.getTotalPrice()
        )).collect(Collectors.toList());

        return new SaleResponse(
                sale.getId(),
                sale.getInvoiceNumber(),
                sale.getCustomerName(),
                sale.getCustomerPhone(),
                sale.getSaleDate(),
                sale.getSubtotal(),
                sale.getDiscount(),
                sale.getTotalAmount(),
                sale.getPaymentMethod(),
                items
        );
    }
}
