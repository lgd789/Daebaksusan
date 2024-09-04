package com.seafood.back.service;

import java.util.List;

import com.seafood.back.dto.CouponAmountResult;
import com.seafood.back.dto.CouponDTO;

public interface CouponService {
    public CouponAmountResult couponAmount(Long memberId, CouponDTO coupon);
    public List<CouponDTO> mapCouponsToDTOs(Long memberId);
    public void removeCoupon(Long memberId, Long couponId);
    public void returnCoupon(Long memberId, CouponDTO coupon);
    public void createMemberCoupon(Long memberId, Long couponId);
}
