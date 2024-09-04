package com.seafood.back.utils;

import java.util.Date;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;

public class JwtUtil {

    public static Long getId(String token, String secretKey) {
        try {
            return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token)
                    .getBody().get("ID", Long.class);
        } catch (ExpiredJwtException e) {
            // Handle expired token
            throw new RuntimeException("Token expired", e);
        } catch (UnsupportedJwtException | MalformedJwtException | SignatureException | IllegalArgumentException e) {
            // Handle other parsing exceptions
            throw new RuntimeException("Invalid token", e);
        }
    }

    public static boolean isExpired(String token, String secretKey) {
        try {
            return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token)
                    .getBody().getExpiration().before(new Date());
        } catch (ExpiredJwtException e) {
            System.out.println(e.getMessage());
            return true;
        } catch (Exception e) {
            // Handle other parsing exceptions
            System.out.println(e.getMessage());
            return true;
        }
    }

    public static String createJwt(Long id, String secretKey, Long expiredMs) {
        Claims claims = Jwts.claims();
        claims.put("ID", id);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiredMs))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    public static String generateAccessTokenFromRefreshToken(String refreshToken, String refreshSecretKey, String accessSecretKey, Long expiredMs) {
        if (isExpired(refreshToken, refreshSecretKey)) {
            // Token expired, handle accordingly
            return null;
        }
        Long id = getId(refreshToken, refreshSecretKey);
        return createJwt(id, accessSecretKey, expiredMs);
    }
}
