package com.cycleshop.service;

import com.cycleshop.dto.ProductDto;
import com.cycleshop.entity.Product;
import com.cycleshop.exception.BadRequestException;
import com.cycleshop.exception.ResourceNotFoundException;
import com.cycleshop.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductDto> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return toDto(product);
    }

    public Product getProductEntityById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public List<ProductDto> searchProducts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllProducts();
        }
        return productRepository.searchProducts(query.trim())
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductDto createProduct(ProductDto dto) {
        if (productRepository.existsByProductNameIgnoreCase(dto.getProductName().trim())) {
            throw new BadRequestException("A product with the name '" + dto.getProductName() + "' already exists. Please update existing product or use a different name.");
        }

        Product product = new Product();
        product.setProductName(dto.getProductName().trim());
        product.setCategory(dto.getCategory().trim());
        product.setBrand(dto.getBrand() != null ? dto.getBrand().trim() : null);
        product.setModel(dto.getModel() != null ? dto.getModel().trim() : null);
        product.setPurchasePrice(dto.getPurchasePrice());
        product.setSellingPrice(dto.getSellingPrice());
        product.setStockQuantity(dto.getStockQuantity() != null ? dto.getStockQuantity() : 0);
        product.setMinimumStock(dto.getMinimumStock() != null ? dto.getMinimumStock() : 5);
        product.setSupplier(dto.getSupplier() != null ? dto.getSupplier().trim() : null);

        Product saved = productRepository.save(product);
        return toDto(saved);
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        if (!product.getProductName().equalsIgnoreCase(dto.getProductName().trim()) &&
                productRepository.existsByProductNameIgnoreCase(dto.getProductName().trim())) {
            throw new BadRequestException("Another product with the name '" + dto.getProductName() + "' already exists.");
        }

        product.setProductName(dto.getProductName().trim());
        product.setCategory(dto.getCategory().trim());
        product.setBrand(dto.getBrand() != null ? dto.getBrand().trim() : null);
        product.setModel(dto.getModel() != null ? dto.getModel().trim() : null);
        product.setPurchasePrice(dto.getPurchasePrice());
        product.setSellingPrice(dto.getSellingPrice());
        product.setStockQuantity(dto.getStockQuantity());
        product.setMinimumStock(dto.getMinimumStock());
        product.setSupplier(dto.getSupplier() != null ? dto.getSupplier().trim() : null);

        Product updated = productRepository.save(product);
        return toDto(updated);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    @Transactional
    public ProductDto intakeStock(Long id, Integer incomingQuantity) {
        if (incomingQuantity == null || incomingQuantity <= 0) {
            throw new BadRequestException("Incoming quantity must be greater than zero.");
        }

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        int existingStock = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
        int newStock = existingStock + incomingQuantity;
        product.setStockQuantity(newStock);

        Product saved = productRepository.save(product);
        return toDto(saved);
    }

    public List<ProductDto> getLowStockProducts() {
        return productRepository.findLowStockProducts()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ProductDto toDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setProductName(product.getProductName());
        dto.setCategory(product.getCategory());
        dto.setBrand(product.getBrand());
        dto.setModel(product.getModel());
        dto.setPurchasePrice(product.getPurchasePrice());
        dto.setSellingPrice(product.getSellingPrice());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setMinimumStock(product.getMinimumStock());
        dto.setSupplier(product.getSupplier());
        dto.setCreatedAt(product.getCreatedAt());

        int stock = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
        int minStock = product.getMinimumStock() != null ? product.getMinimumStock() : 5;

        if (stock == 0) {
            dto.setStockStatus("OUT_OF_STOCK");
        } else if (stock <= minStock) {
            dto.setStockStatus("LOW_STOCK");
        } else {
            dto.setStockStatus("IN_STOCK");
        }

        return dto;
    }
}
