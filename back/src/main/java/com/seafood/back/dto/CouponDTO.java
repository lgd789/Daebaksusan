package com.seafood.back.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CouponDTO {
    private Long Id;
    private Long couponId;
    private String couponName;
    private BigDecimal discount;
    private BigDecimal minimumOrderAmount;
    private Date issueDate;
    private Date validUntil;
}
