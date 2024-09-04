package com.seafood.back.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.WebRequest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seafood.back.dto.TokenDTO;
import com.seafood.back.service.MemberService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SocialController {

    private final RestTemplate restTemplate;
    private final MemberService memberService;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String kakaoClientId;

    @Value("${spring.security.oauth2.client.registration.kakao.client-secret}")
    private String kakaoClientSecret;

    @Value("${spring.security.oauth2.client.provider.kakao.token-uri}")
    private String kakaoTokenUri;

    @Value("${kakao.authorization.redirect-uri}")
    private String kakaoRedirectUri;

    @Value("${spring.security.oauth2.client.registration.naver.client-id}")
    private String naverClientId;

    @Value("${spring.security.oauth2.client.registration.naver.client-secret}")
    private String naverClientSecret;

    @Value("${spring.security.oauth2.client.provider.naver.token-uri}")
    private String naverTokenUri;

    @Value("${naver.authorization.redirect-uri}")
    private String naverRedirectUri;

    @GetMapping("/authorize")
    public void handleAuthorize(@RequestParam("type") String type, @RequestParam("redirectPath") String redirectPath, HttpServletResponse response, WebRequest req) throws IOException {
        req.setAttribute("redirectPath", redirectPath, WebRequest.SCOPE_SESSION);

        String url = "";
        String redirectUrl = "";
        if (type.equals("kakao")) {
            url = "https://kauth.kakao.com/oauth/authorize";
            redirectUrl = kakaoRedirectUri;
        } else if (type.equals("naver")) {
            url = "https://nid.naver.com/oauth2.0/authorize";
            redirectUrl = naverRedirectUri;
        }

        String authRedirectUrl = url + "?client_id=" + (type.equals("kakao") ? kakaoClientId : naverClientId) +
            "&redirect_uri=" + redirectUrl + "&response_type=code";

        response.sendRedirect(authRedirectUrl);
    }

    @GetMapping("/callback/kakao")
    public void handleKakaoCallback(@RequestParam("code") String code, HttpServletResponse response, WebRequest req, SessionStatus sessionStatus) throws IOException {
        log.info("code: " + code);

        String url = kakaoTokenUri;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", kakaoClientId);
        params.add("client_secret", kakaoClientSecret);
        params.add("redirect_uri", kakaoRedirectUri);
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        try {
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(url, request, String.class);
            log.info("Response: " + responseEntity.getBody());

            // 액세스 토큰 추출
            String accessToken = extractAccessToken(responseEntity.getBody());

            // 성공 시 프론트엔드로 리디렉션
            String redirectPath = (String) req.getAttribute("redirectPath", WebRequest.SCOPE_SESSION);
            System.out.println(redirectPath);
            response.sendRedirect(frontendUrl + "/auth/callback?socialConfirmed=true&token=" + accessToken + "&redirectPath=" + redirectPath);
        } catch (HttpClientErrorException ex) {
            log.error("HTTP 요청 실패: " + ex.getStatusCode());
            log.error("오류 응답: " + ex.getResponseBodyAsString());
            response.sendRedirect(frontendUrl + "/auth/callback?socialConfirmed=false");
        }
    }

    @GetMapping("/callback/naver")
    public void handleNaverCallback(@RequestParam("code") String code, @RequestParam("state") String state, HttpServletResponse response, WebRequest req, SessionStatus sessionStatus) throws IOException {
        log.info("code: " + code);

        String url = naverTokenUri;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", naverClientId);
        params.add("client_secret", naverClientSecret);
        params.add("redirect_uri", naverRedirectUri);
        params.add("code", code);
        params.add("state", state);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        try {
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(url, request, String.class);
            log.info("Response: " + responseEntity.getBody());

            // 액세스 토큰 추출
            String accessToken = extractAccessToken(responseEntity.getBody());

            // 성공 시 프론트엔드로 리디렉션
            String redirectPath = (String) req.getAttribute("redirectPath", WebRequest.SCOPE_SESSION);
            System.out.println(redirectPath);
            response.sendRedirect(frontendUrl + "/auth/callback?socialConfirmed=true&token=" + accessToken + "&redirectPath=" + redirectPath);
        } catch (HttpClientErrorException ex) {
            log.error("HTTP 요청 실패: " + ex.getStatusCode());
            log.error("오류 응답: " + ex.getResponseBodyAsString());
            response.sendRedirect(frontendUrl + "/auth/callback?socialConfirmed=false");
        }
    }

    @PostMapping("social/match")
    public ResponseEntity<?> matchUser(Authentication authentication, @RequestBody TokenDTO token) {
        try {
            Long memberId = Long.parseLong(authentication.getName());
            System.out.println("memberId: " + memberId);
            Boolean match = memberService.matchUser(memberId, token.getToken());

            return ResponseEntity.ok().body(match);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private String extractAccessToken(String responseBody) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> responseMap = objectMapper.readValue(responseBody, Map.class);
            return (String) responseMap.get("access_token");
        } catch (IOException e) {
            log.error("토큰 추출 실패", e);
            return null;
        }
    }
}
