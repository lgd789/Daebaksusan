package com.seafood.back.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seafood.back.utils.JwtUtil;

@RestController
@RequestMapping("/api/v1")
public class TokenController {

    @Value("${jwt.refresh.token}")
    private String refreshSecretKey;

    @Value("${jwt.secret.token}")
    private String accessSecretKey;

    @Value("${jwt.secret.expired.ms}")
    private long expiredMs;

    @PostMapping("/refreshToken")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> refreshTokenMap) {
        String refreshToken = refreshTokenMap.get("refreshToken");
        if (refreshToken == null) {
            return ResponseEntity.badRequest().body("Refresh token is required");
        }

        try {
            String newAccessToken = JwtUtil.generateAccessTokenFromRefreshToken(refreshToken, refreshSecretKey, accessSecretKey, expiredMs);
            Map<String, String> response = new HashMap<>();
            response.put("accessToken", newAccessToken);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to generate new access token");
        }
    }
}
