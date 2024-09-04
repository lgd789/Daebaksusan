package com.seafood.back.respository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.seafood.back.entity.MemberCouponEntity;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

public interface MemberCouponRepository extends JpaRepository<MemberCouponEntity, Long> {
    List<MemberCouponEntity> findCouponsByMember_memberId(Long memberId);

    MemberCouponEntity deleteByIdAndMember_memberId(Long id, Long memberId);

    List<MemberCouponEntity> findByValidUntilBefore(Date now);

    void deleteByIdInAndMember_memberId(List<Long> expiredCouponIds, Long memberId);

    MemberCouponEntity findByIdAndMember_memberId(Long id, Long memberId);
}