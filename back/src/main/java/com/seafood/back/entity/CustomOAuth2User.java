package com.seafood.back.entity;

import java.util.Collection;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
public class CustomOAuth2User implements OAuth2User {

    private String id;
    private Long memberId;
    private String loginType;
    
    @Override
    public Map<String, Object> getAttributes() {
        return null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    public String getId() {
        return this.id;
    }

    
    public String getLoginType() { // 로그인 유형을 반환하는 메서드 추가
        return this.loginType;
    }

    @Override
    public String getName() {
        return String.valueOf(this.memberId);
    }
}
