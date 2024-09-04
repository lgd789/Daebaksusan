package com.seafood.back.handler;

import java.io.IOException;

import org.hibernate.annotations.Comment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.seafood.back.entity.CustomOAuth2User;
import com.seafood.back.utils.JwtUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler{
    private static final Logger logger = LoggerFactory.getLogger(OAuth2SuccessHandler.class);
    // private final JwtUtil jwtUtil;

    @Value("${jwt.secret.token}")
    private String accessSecretKey;

    @Value("${jwt.refresh.token}")
    private String refreshSecretKey;

    @Value("${frontend.url}")
    private String frontendUrl;


    @Value("${jwt.refresh.expired.ms}")
    private long refreshTokenExpiredMs;

    @Value("${jwt.secret.expired.ms}")
    private long accessTokenExpiredMs;

    @Override
    public void onAuthenticationSuccess(
        HttpServletRequest request, 
        HttpServletResponse response, 
        Authentication authentication
    ) throws IOException, ServletException {
        
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        
        Long memberId = Long.parseLong(oAuth2User.getName());

        String token = JwtUtil.createJwt(memberId, accessSecretKey, accessTokenExpiredMs);
        String refreshToken = JwtUtil.createJwt(memberId, refreshSecretKey, refreshTokenExpiredMs);

        response.sendRedirect(frontendUrl + "/auth/oauth-response/" + token + "&" + refreshToken);
        
        logger.info("Login - Message: {}, MemberId: {}, ID: {}, Type: {}",  "로그인 성공", memberId, oAuth2User.getId(), oAuth2User.getLoginType());
    }
}
