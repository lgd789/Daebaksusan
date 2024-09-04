package com.seafood.back.respository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.seafood.back.entity.CouponEntity;

@Repository
public interface CouponRepository extends JpaRepository<CouponEntity, Long> {

    CouponEntity findByCouponId(Long couponId);
    
}