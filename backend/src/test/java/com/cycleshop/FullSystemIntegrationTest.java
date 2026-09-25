package com.cycleshop;

import com.cycleshop.dto.LoginRequest;
import com.cycleshop.dto.LoginResponse;
import com.cycleshop.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class FullSystemIntegrationTest {

    @Autowired
    private AuthService authService;

    @Test
    void testNivethaLogin() {
        authService.upsertAdmin("Nivetha", "Nive@1234");
        LoginResponse response = authService.login(new LoginRequest("Nivetha", "Nive@1234"));
        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals("Nivetha", response.getUsername());
    }
}
