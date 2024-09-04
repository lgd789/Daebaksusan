// package com.seafood.back.service.imple;

// import java.io.IOException;
// import java.util.Map;

// import org.springframework.http.HttpEntity;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.ResponseEntity;
// import org.springframework.stereotype.Service;
// import org.springframework.web.client.HttpClientErrorException;
// import org.springframework.web.client.RestTemplate;

// import com.fasterxml.jackson.databind.ObjectMapper;
// import com.seafood.back.dto.MemberDTO;
// import com.seafood.back.dto.TokenDTO;
// import com.seafood.back.service.MemberService;
// import com.seafood.back.service.SocialService;

// import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor
// public class SocialServiceImple implements SocialService {

//     private final RestTemplate restTemplate;
//     private final MemberService memberService;

//     public Boolean matchUser(Long memberId, String token) {
//         MemberDTO memberDto = memberService.getMemberInfo(memberId);
//         String id = memberDto.getId();
        
//         String socialId = null;
    
//         if (memberDto.getType().equals("kakao")) {
//             socialId = getKakaoUserId(token);
//         } else if (memberDto.getType().equals("naver")) {
//             socialId = getNaverUserId(token);
//         }
//         System.out.println("socialId: " + socialId);
//         if (socialId == null) {
//             return false;
//         }
    
//         // id에서 "kakao_" 또는 "naver_" 접두사 제거
//         String strippedId = id.replaceFirst("^(kakao_|naver_)", "");
    
//         return strippedId.equals(socialId);
//     }

//     private String getKakaoUserId(String accessToken) {
//         String url = "https://kapi.kakao.com/v2/user/me";

//         HttpHeaders headers = new HttpHeaders();
//         headers.setBearerAuth(accessToken);

//         HttpEntity<Void> request = new HttpEntity<>(headers);

//         try {
//             ResponseEntity<String> responseEntity = restTemplate.postForEntity(url, request, String.class);

//             ObjectMapper objectMapper = new ObjectMapper();
//             Map<String, Object> responseMap = objectMapper.readValue(responseEntity.getBody(), Map.class);
//             return String.valueOf(responseMap.get("id"));
//         } catch (IOException | HttpClientErrorException ex) {
//             return null;
//         }
//     }

//     private String getNaverUserId(String accessToken) {
//         String url = "https://openapi.naver.com/v1/nid/me";

//         HttpHeaders headers = new HttpHeaders();
//         headers.setBearerAuth(accessToken);

//         HttpEntity<Void> request = new HttpEntity<>(headers);

//         try {
//             ResponseEntity<String> responseEntity = restTemplate.getForEntity(url, String.class, request);

//             ObjectMapper objectMapper = new ObjectMapper();
//             Map<String, Object> responseMap = objectMapper.readValue(responseEntity.getBody(), Map.class);
//             Map<String, Object> response = (Map<String, Object>) responseMap.get("response");
//             return ((String) response.get("id")).substring(0, 14);
//         } catch (IOException | HttpClientErrorException ex) {
//             return null;
//         }
//     }
// }
