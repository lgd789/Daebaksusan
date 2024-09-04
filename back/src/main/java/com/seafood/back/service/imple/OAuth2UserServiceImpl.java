package com.seafood.back.service.imple;

import java.math.BigDecimal;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.seafood.back.controller.MemberController;
import com.seafood.back.entity.CustomOAuth2User;
import com.seafood.back.entity.MemberEntity;
import com.seafood.back.entity.MemberPointsEntity;
import com.seafood.back.respository.MemberPointsRepository;
import com.seafood.back.respository.MemberRepository;
import com.seafood.back.service.CouponService;
import com.seafood.back.service.MemberService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OAuth2UserServiceImpl extends DefaultOAuth2UserService{
    
    private static final Logger logger = LoggerFactory.getLogger(OAuth2UserServiceImpl.class);

    private final MemberRepository memberRepository;
    private final CouponService couponService;
    private final MemberPointsRepository memberPointsRepository;

    @Transactional
    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException{

        OAuth2User oAuth2User = super.loadUser(request);
        String oauthClientName = request.getClientRegistration().getClientName();


        // try{
        //     System.out.println(new ObjectMapper().writeValueAsString(oAuth2User.getAttributes()));
        // }catch(Exception exception){
        //     exception.printStackTrace();
        // }

        MemberEntity memberEntity = null;
        String id = "";
        String name = "";
        String phone = "";
        String email = "email@email.com";

        if(oauthClientName.equals("kakao")){
            id = "kakao_" + oAuth2User.getAttributes().get("id");
            Map<String, String> reponseMap = (Map<String, String>) oAuth2User.getAttributes().get("kakao_account");
            name = reponseMap.get("name");
            phone = reponseMap.get("phone_number").replaceFirst("\\+82 ", "0");
            email = reponseMap.get("email");
        

            memberEntity = new MemberEntity(id, "pass", name, phone, email, "kakao");
        }
        if(oauthClientName.equals("naver")){
            Map<String, String> reponseMap = (Map<String, String>) oAuth2User.getAttributes().get("response");
            id = "naver_" + reponseMap.get("id").substring(0, 14);
            name = reponseMap.get("name");
            phone = reponseMap.get("mobile");
            email = reponseMap.get("email");
            memberEntity = new MemberEntity(id, "pass", name, phone, email, "naver");

        }

        MemberEntity member = memberRepository.findById(id);
        if (member == null) {
            member = memberRepository.save(memberEntity);

                        // 회원 포인트 정보 생성 및 저장
            MemberPointsEntity memberPoints = new MemberPointsEntity();
            memberPoints.setMemberId(member.getMemberId());
            memberPoints.setPoints(BigDecimal.ZERO); // 초기 포인트는 0으로 설정
            memberPointsRepository.save(memberPoints);

            couponService.createMemberCoupon(member.getMemberId(), (long) 3);

            logger.info("Register - Message: {}, MemberId: {}, ID: {}, Type: {}",  "회원가입 성공", member.getMemberId(), member.getId(), member.getType());
        }

        
        return new CustomOAuth2User(member.getId(), member.getMemberId(), oauthClientName);
    }
}
