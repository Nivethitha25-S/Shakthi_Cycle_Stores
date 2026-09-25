package com.cycleshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.cycleshop.repository")
@EntityScan(basePackages = "com.cycleshop.entity")
public class CycleShopApplication {

    public static void main(String[] args) {
        SpringApplication.run(CycleShopApplication.class, args);
    }
}
