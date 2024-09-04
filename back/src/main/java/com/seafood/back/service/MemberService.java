package com.seafood.back.service;

import java.math.BigDecimal;

import com.seafood.back.dto.MemberDTO;
import com.seafood.back.dto.MemberUpdateDTO;
import com.seafood.back.entity.MemberEntity;

public interface MemberService {
    public MemberEntity authenticateMember(String id, String password);
    public MemberEntity authenticateMember(Long memberId, String password);
    public String getAccessToken(Long memberId);
    public String getRefreshToken(Long memberId);
    public MemberEntity registerNewMember(MemberEntity member);
    public MemberDTO getMemberInfo(Long memberId);
    public BigDecimal getAvailablePoints(Long memberId);
    public BigDecimal deductPoints(Long memberId, BigDecimal points);
    public void updateMember(MemberUpdateDTO memberUpdateDTO);
    public void withdrawMember(Long memberId, String password, String token);
    public Boolean matchUser(Long memberId, String token);
    public String findAccountId(String name, String email);
    public String findAccountPassword(String name, String email, String id);
}

