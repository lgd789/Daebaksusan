package com.seafood.back.respository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.seafood.back.entity.MemberEntity;

public interface MemberRepository extends JpaRepository<MemberEntity, Integer> {
    // MemberEntity findById(String id);

    MemberEntity findByMemberId(Long memberId);

    MemberEntity findById(String id);

    MemberEntity findByNameAndEmailAndType(String name, String email, String string);
}