package com.seafood.back.dto;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CouponAmountResult {
    private BigDecimal couponAmount;
    private BigDecimal minimumOrderAmount;

    public CouponAmountResult(BigDecimal couponAmount, BigDecimal minimumOrderAmount) {
        this.couponAmount = couponAmount;
        this.minimumOrderAmount = minimumOrderAmount;
    }
}
