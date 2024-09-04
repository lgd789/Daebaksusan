package com.seafood.back.config;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import com.seafood.back.utils.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private final String secretKey;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        final String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);
        log.info("authorization : {}", authorization);

        // 토큰이 없거나 "Bearer "로 시작하지 않을 때
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            log.error("Authorization header is missing or invalid");
            filterChain.doFilter(request, response);
            return;
        }

        // Token 꺼내기
        String token = authorization.split(" ")[1].trim();
        
        // Bearer null 처리
        if ("null".equals(token) || token.isEmpty()) {
            log.error("Token is null or empty");
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("Token is null or empty");
            return;
        }

        try {
            if (JwtUtil.isExpired(token, secretKey)) {
                log.error("Token is expired");
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("Token is expired");
                return;
            }

            // UserName Token에서 꺼내기
            Long id = JwtUtil.getId(token, secretKey);
            log.info("User ID: {}", id);

            // 권한 부여
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(id, null, List.of(new SimpleGrantedAuthority("USER")));
            
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        } catch (Exception e) {
            log.error("JWT token processing failed: {}", e.getMessage());
            // Handle token validation error
        }

        filterChain.doFilter(request, response);
    }
}
