package com.cycleshop.service;

import com.cycleshop.dto.LoginRequest;
import com.cycleshop.dto.LoginResponse;
import com.cycleshop.entity.Admin;
import com.cycleshop.exception.BadRequestException;
import com.cycleshop.repository.AdminRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuthService {

    private final AdminRepository adminRepository;

    public AuthService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public LoginResponse login(LoginRequest request) {
        Admin admin = adminRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadRequestException("Invalid username or password"));

        boolean matches = BCrypt.checkpw(request.getPassword(), admin.getPasswordHash());
        if (!matches) {
            throw new BadRequestException("Invalid username or password");
        }

        String token = "adm_" + UUID.randomUUID().toString().replace("-", "");
        return new LoginResponse(true, "Login successful", admin.getUsername(), token);
    }

    @Transactional
    public Admin createAdminIfNotExists(String username, String rawPassword) {
        if (!adminRepository.existsByUsername(username)) {
            String hash = BCrypt.hashpw(rawPassword, BCrypt.gensalt(10));
            Admin admin = new Admin(username, hash);
            return adminRepository.save(admin);
        }
        return adminRepository.findByUsername(username).orElse(null);
    }

    @Transactional
    public Admin upsertAdmin(String username, String rawPassword) {
        String hash = BCrypt.hashpw(rawPassword, BCrypt.gensalt(10));
        Admin admin = adminRepository.findByUsername(username).orElseGet(() -> new Admin(username, hash));
        admin.setPasswordHash(hash);
        Admin saved = adminRepository.save(admin);

        if (!"admin".equalsIgnoreCase(username)) {
            adminRepository.findByUsername("admin").ifPresent(adminRepository::delete);
        }
        return saved;
    }
}
