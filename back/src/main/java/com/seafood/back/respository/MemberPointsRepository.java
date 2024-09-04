package com.seafood.back.respository;
import com.seafood.back.entity.MemberPointsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberPointsRepository extends JpaRepository<MemberPointsEntity, Long> {
    MemberPointsEntity findByMemberId(Long memberId);
}