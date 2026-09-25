package com.cycleshop.config;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.cycleshop.entity.Product;
import com.cycleshop.repository.ProductRepository;
import com.cycleshop.service.AuthService;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final AuthService authService;
    private final ProductRepository productRepository;

    public DataInitializer(AuthService authService, ProductRepository productRepository) {
        this.authService = authService;
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        try {
            authService.upsertAdmin("Nivethitha", "Nive@25");
            logger.info("Admin user 'Nivethitha' initialized with updated credentials.");
        } catch (Exception e) {
            logger.warn("Could not check/initialize admin: {}", e.getMessage());
        }

        try {
            if (productRepository.count() == 0) {
                List<Product> initialProducts = Arrays.asList(
                        new Product("Hero Sprint Pro", "Bicycles", "Hero", "Sprint 26T",
                                new BigDecimal("8500.00"), new BigDecimal("10500.00"), 18, 5, "Hero Cycles Ltd"),
                        new Product("Hercules MTB Roadeo", "Bicycles", "Hercules", "Hardtail 27.5",
                                new BigDecimal("11000.00"), new BigDecimal("13999.00"), 12, 4, "TI Cycles of India"),
                        new Product("Firefox Road Runner Pro", "Bicycles", "Firefox", "Road 700C",
                                new BigDecimal("16000.00"), new BigDecimal("19500.00"), 8, 3, "Firefox Bikes"),
                        new Product("Safety Riding Helmet", "Accessories", "Rockbros", "Aero Shield M/L",
                                new BigDecimal("550.00"), new BigDecimal("900.00"), 4, 5, "Apex Sports Gear"),
                        new Product("Classic Brass Cycle Bell", "Accessories", "Bellpro", "Ding-Dong Retro",
                                new BigDecimal("80.00"), new BigDecimal("150.00"), 25, 8, "City Cycle Spares"),
                        new Product("Hydraulic Disc Brake Set", "Spare Parts", "Shimano", "Altus MT200",
                                new BigDecimal("1800.00"), new BigDecimal("2500.00"), 3, 5, "Shimano India"),
                        new Product("High Security Cycle Cable Lock", "Security", "GuardX", "5-Digit Heavy Cable",
                                new BigDecimal("220.00"), new BigDecimal("450.00"), 15, 6, "GuardX Security Ltd"),
                        new Product("Rechargeable USB LED Headlight", "Lights", "BrightRide", "1200 Lumens Waterproof",
                                new BigDecimal("400.00"), new BigDecimal("750.00"), 2, 5, "Apex Sports Gear")
                );

                productRepository.saveAll(initialProducts);
                logger.info("Seeded initial cycle shop products into inventory.");
            }
        } catch (Exception e) {
            logger.warn("Could not seed initial products: {}", e.getMessage());
        }
    }
}
