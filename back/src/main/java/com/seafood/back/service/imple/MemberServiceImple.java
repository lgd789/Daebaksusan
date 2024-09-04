package com.seafood.back.service.imple;

import java.io.IOException;
import java.math.BigDecimal;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seafood.back.controller.MemberController;
import com.seafood.back.dto.CouponDTO;
import com.seafood.back.dto.MemberDTO;
import com.seafood.back.dto.MemberUpdateDTO;
import com.seafood.back.entity.MemberEntity;
import com.seafood.back.entity.MemberPointsEntity;
import com.seafood.back.respository.MemberPointsRepository;
import com.seafood.back.respository.MemberRepository;
import com.seafood.back.service.CouponService;
import com.seafood.back.service.MailService;
import com.seafood.back.service.MemberService;
import com.seafood.back.utils.JwtUtil;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberServiceImple implements MemberService {

    private static final Logger logger = LoggerFactory.getLogger(MemberServiceImple.class);

    private final RestTemplate restTemplate;

    private final CouponService couponService;

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final MemberPointsRepository memberPointsRepository;

    private final MailService mailService;
    private final TemplateEngine templateEngine;

    @Value("${jwt.secret.token}")
    private String accessSecretKey;

    @Value("${jwt.refresh.token}")
    private String refreshSecretKey;
    
    @Value("${jwt.refresh.expired.ms}")
    private long refreshTokenExpiredMs;

    @Value("${jwt.secret.expired.ms}")
    private long accessTokenExpiredMs;

    @Value("${spring.security.oauth2.client.registration.naver.client-id}")
    private String naverClientId;

    @Value("${spring.security.oauth2.client.registration.naver.client-secret}")
    private String naverClientSecret;

    @Override
    public String getAccessToken(Long memberId) {
        return JwtUtil.createJwt(memberId, accessSecretKey, accessTokenExpiredMs);
    }

    @Override
    public String getRefreshToken(Long memberId) {
        return JwtUtil.createJwt(memberId, refreshSecretKey, refreshTokenExpiredMs);
    }

    @Override
    public MemberEntity authenticateMember(Long memberId, String password) {
        MemberEntity member = memberRepository.findByMemberId(memberId);

        if (!passwordEncoder.matches(password, member.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        return member;
    }

    @Override
    public MemberEntity authenticateMember(String id, String password) {
        MemberEntity member = memberRepository.findById(id);

        if (member == null) {
            logger.error("Login - Message: {}, MemberId: {}, ID: {}, Type: {}", "아이디 불일치", null, id, "sign");
            throw new RuntimeException("해당 아이디가 존재하지 않습니다.");
        }
        if (!passwordEncoder.matches(password, member.getPassword())) {
            logger.error("Login - Message: {}, MemberId: {}, ID: {}, Type: {}", "비밀번호 불일치", member.getMemberId(), member.getId(), member.getType());
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        logger.info("Login - Message: {}, MemberId: {}, ID: {}, Type: {}",  "로그인 성공", member.getMemberId(), member.getId(), member.getType());
        return member;
    }

    @Transactional
    @Override
    public MemberEntity registerNewMember(MemberEntity member) {
        try {
            member.setPassword(passwordEncoder.encode(member.getPassword()));
            member.setRole("ROLE_USER");
            member.setType("sign");
            member.setCreateAt(new Date());

            MemberEntity savedMember = memberRepository.save(member);

            // 회원 포인트 정보 생성 및 저장
            MemberPointsEntity memberPoints = new MemberPointsEntity();
            memberPoints.setMemberId(savedMember.getMemberId());
            memberPoints.setPoints(BigDecimal.ZERO); // 초기 포인트는 0으로 설정
            memberPointsRepository.save(memberPoints);

            couponService.createMemberCoupon(member.getMemberId(), (long) 3);

            logger.info("Register - Message: {}, MemberId: {}, ID: {}, Type: {}",  "회원가입 성공", savedMember.getMemberId(), savedMember.getId(), savedMember.getType());
            return savedMember;
        } catch (DataIntegrityViolationException e) {
            // 중복된 아이디가 있을 경우에 대한 예외 처리
            logger.error("Register - Message: {}, ID: {}, Type: {}",  "중복된 아이디", member.getId(), member.getType());
            throw new DataIntegrityViolationException("중복된 아이디입니다.");
        } catch (Exception e) {
            // 그 외 예외에 대한 예외 처리
            logger.error("Register - Message: {}, ID: {}, Type: {}",  "회원가입 오류"+ e, member.getId(), member.getType());
            throw new RuntimeException("회원 가입 중 오류가 발생했습니다.", e);
        }
    }

    @Override
    public MemberDTO getMemberInfo(Long memberId) {
        MemberEntity member = memberRepository.findByMemberId(memberId);
        MemberDTO memberDto = new MemberDTO();
    
        memberDto.setMemberId(member.getMemberId());
        memberDto.setId(member.getId());
        memberDto.setName(member.getName());
        memberDto.setPhone(member.getPhone());
        memberDto.setEmail(member.getEmail());
        memberDto.setPostalCode(member.getPostalCode());
        memberDto.setAddress(member.getAddress());
        memberDto.setDetailAddress(member.getDetailAddress());
        memberDto.setType(member.getType());

        MemberPointsEntity memberPoints = memberPointsRepository.findByMemberId(memberId);
        if (memberPoints != null) {
            memberDto.setPoints(memberPoints.getPoints());
        } else {
            memberDto.setPoints(BigDecimal.ZERO);
        }

        List<CouponDTO> couponDTOs = couponService.mapCouponsToDTOs(memberId);
        memberDto.setCoupons(couponDTOs);

        return memberDto;
    }

    @Override
    public BigDecimal getAvailablePoints(Long memberId) {
        MemberPointsEntity memberPoints = memberPointsRepository.findByMemberId(memberId);
        return memberPoints != null ? memberPoints.getPoints() : BigDecimal.ZERO;
    }

    @Transactional
    @Override
    public BigDecimal deductPoints(Long memberId, BigDecimal points) {
        // 회원의 포인트 정보 조회
        MemberEntity member = memberRepository.findByMemberId(memberId);
        if (member == null) {
            throw new IllegalArgumentException("해당 회원 정보가 없습니다.");
        }
        MemberPointsEntity memberPoints = memberPointsRepository.findByMemberId(memberId);


        if (memberPoints != null) {
            BigDecimal currentPoints = memberPoints.getPoints();
            BigDecimal updatedPoints = currentPoints.subtract(points);
            if (updatedPoints.compareTo(BigDecimal.ZERO) < 0) {
                logger.error("Point - Message: {}, Deduction Amount: {}, Current Points: {}, Member ID: {}, Id: {}",
                        "차감할 포인트보다 회원의 보유 포인트가 적습니다.",
                        points,
                        currentPoints,
                        member.getMemberId(),
                        member.getId());
                throw new IllegalArgumentException("차감할 포인트보다 회원의 보유 포인트가 적습니다.");
            }

            memberPoints.setPoints(updatedPoints);
            MemberPointsEntity savedMemberPointsEntity = memberPointsRepository.save(memberPoints);

            String message;
            if (points.compareTo(BigDecimal.ZERO) > 0) {
                message = "포인트가 차감되었습니다.";
            } else {
                message = "포인트가 추가되었습니다.";
            }
            logger.info("Point - Message: {}, Deduction Amount: {}, Current Points: {}, Updated Points: {}, Member ID: {}, Id: {}",
                        message,
                        points,
                        currentPoints,
                        savedMemberPointsEntity.getPoints(),
                        member.getMemberId(),
                        member.getId());
            return memberPoints.getPoints();
        } else {
            logger.error("Point - Message: {}, Deduction Amount: {}, Current Points: {}, Member ID: {}, Id: {}",
                        points,
                        null,
                        member.getMemberId(),
                        member.getId());
            throw new IllegalArgumentException("해당 회원의 포인트 정보가 없습니다.");
        }
    }

    @Override
    public void updateMember(MemberUpdateDTO memberUpdateDTO) {
        MemberEntity member = memberRepository.findByMemberId(memberUpdateDTO.getMemberId());
        
        if (member == null) {
            throw new IllegalArgumentException("해당 ID를 가진 회원이 없습니다.");
        }

        if (memberUpdateDTO.getCurrentPassword() != null && !memberUpdateDTO.getCurrentPassword().isEmpty()) {

            if (!passwordEncoder.matches(memberUpdateDTO.getCurrentPassword(), member.getPassword())) {
                throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
            }
        }

        if (memberUpdateDTO.getPassword() != null && !memberUpdateDTO.getPassword().isEmpty()) {
            member.setPassword(passwordEncoder.encode(memberUpdateDTO.getPassword()));
        }

        if (memberUpdateDTO.getEmail() != null) {
            member.setEmail(memberUpdateDTO.getEmail());
        }

        if (memberUpdateDTO.getPostalCode() != null) {
            member.setPostalCode(memberUpdateDTO.getPostalCode());
        }
        if (memberUpdateDTO.getAddress() != null) {
            member.setAddress(memberUpdateDTO.getAddress());
        }
        if (memberUpdateDTO.getDetailAddress() != null) {
            member.setDetailAddress(memberUpdateDTO.getDetailAddress());
        }

        memberRepository.save(member);
    }

    @Transactional
    @Override
    public void withdrawMember(Long memberId, String password, String token) {
        MemberEntity memberEntity = memberRepository.findByMemberId(memberId);
        if (memberEntity == null) {
            throw new RuntimeException("해당하는 회원이 없습니다.");
        }

        if (memberEntity.getType().equals("sign")) {
            MemberEntity member = authenticateMember(memberId, password);

            if (member == null) {
                throw new RuntimeException("해당하는 회원이 없습니다.");
            }

            memberRepository.delete(memberEntity);
        } else {
            if (token == null) {
                throw new RuntimeException("로그인 인증이 필요합니다.");
            }
            if (!matchUser(memberId, token)) {
                throw new RuntimeException("해당하는 회원이 없습니다.");
            }
            withdrawSocialUser(memberEntity.getType(), token);
            memberRepository.delete(memberEntity);

        }

    }

    private void withdrawSocialUser(String type, String token) {

        if (type.equals("kakao")) {
            String url = "https://kapi.kakao.com/v1/user/unlink";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.set("Authorization", "Bearer " + token);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            // 응답 처리
            if (response.getStatusCode() == HttpStatus.OK) {
                // 탈퇴 성공
                System.out.println("사용자 탈퇴가 완료되었습니다.");
            } else {
                // 탈퇴 실패
                System.out.println("사용자 탈퇴에 실패했습니다.");
            }
        } else if ((type.equals("naver"))) {
            String url = "https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id={클라이언트ID}&client_secret={클라이언트시크릿}&access_token={액세스토큰}&service_provider=NAVER";

            url = url.replace("{클라이언트ID}", naverClientId)
                    .replace("{클라이언트시크릿}", naverClientSecret)
                    .replace("{액세스토큰}", token);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);

            // 응답 처리
            if (response.getStatusCode() == HttpStatus.OK) {
                // 탈퇴 성공
                System.out.println("네이버 사용자 탈퇴가 완료되었습니다.");
            } else {
                // 탈퇴 실패
                System.out.println("네이버 사용자 탈퇴에 실패했습니다.");
            }
        }
    }

    @Override
    public Boolean matchUser(Long memberId, String token) {
        MemberDTO memberDto = getMemberInfo(memberId);
        String id = memberDto.getId();

        String socialId = null;

        if (memberDto.getType().equals("kakao")) {
            socialId = getKakaoUserId(token);
        } else if (memberDto.getType().equals("naver")) {
            socialId = getNaverUserId(token);
        }
        if (socialId == null) {
            return false;
        }

        String strippedId = id.replaceFirst("^(kakao_|naver_)", "");
        return strippedId.equals(socialId);
    }

    private String getKakaoUserId(String accessToken) {
        String url = "https://kapi.kakao.com/v2/user/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(url, request, String.class);

            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> responseMap = objectMapper.readValue(responseEntity.getBody(), Map.class);
            return String.valueOf(responseMap.get("id"));
        } catch (IOException | HttpClientErrorException ex) {
            return null;
        }
    }

    private String getNaverUserId(String accessToken) {
        try {
            String url = "https://openapi.naver.com/v1/nid/me";

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken); // 액세스 토큰을 Authorization 헤더에 Bearer로 설정

            // HttpEntity 대신 RequestEntity를 사용하여 GET 요청에 맞게 수정
            RequestEntity<Void> request = RequestEntity.get(new URI(url))
                    .headers(headers)
                    .build();

            ResponseEntity<String> responseEntity = restTemplate.exchange(request, String.class);

            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> responseMap = objectMapper.readValue(responseEntity.getBody(), Map.class);
            Map<String, Object> response = (Map<String, Object>) responseMap.get("response");
            return ((String) response.get("id")).substring(0, 14); // 사용자 ID 반환
        } catch (IOException | HttpClientErrorException | URISyntaxException ex) {
            return null; // 예외 발생 시 null 반환
        }
    }

    @Override
    public String findAccountId(String name, String email) {
        MemberEntity memberEntity = memberRepository.findByNameAndEmailAndType(name, email, "sign");
    
        if (memberEntity == null) {
            throw new RuntimeException("해당하는 회원이 없습니다.");
        }

        return memberEntity.getId();
    }

    @Override
    public String findAccountPassword(String name, String email, String id) {
        // 사용자 계정 조회
        MemberEntity memberEntity = memberRepository.findByNameAndEmailAndType(name, email, "sign");
    
        if (memberEntity == null || !memberEntity.getId().equals(id)) {
            throw new RuntimeException("해당하는 회원이 없습니다.");
        }

        String tempPassword = generateTempPassword();
        
        memberEntity.setPassword(passwordEncoder.encode(tempPassword));
        memberRepository.save(memberEntity);
    
        sendTempPasswordEmail(email, tempPassword);
    
        return "임시 비밀번호가 이메일로 전송되었습니다.";
    }

    private String generateTempPassword() {
        int length = 10;
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder password = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int index = (int) (Math.random() * chars.length());
            password.append(chars.charAt(index));
        }
        return password.toString();
    }

    private void sendTempPasswordEmail(String email, String tempPassword) {
        Context context = new Context();
        context.setVariable("tempPassword", tempPassword);

        String message = templateEngine.process("TempPasswordEmail.html", context);

        mailService.sendMail(email, message, true);

    }
    

}
