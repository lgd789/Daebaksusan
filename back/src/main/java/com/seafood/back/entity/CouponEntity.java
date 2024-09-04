package com.seafood.back.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "coupons")
@Getter
@Setter
public class CouponEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "coupon_id")
    private Long couponId;

    @Column(name = "coupon_code", nullable = false, unique = true)
    private String couponCode;

    @Column(name = "coupon_name", nullable = false)
    private String couponName;

    @Column(name = "discount", nullable = false)
    private BigDecimal discount;

    @Column(name = "valid_from", nullable = false)
    private Date validFrom;

    @Column(name = "valid_until", nullable = false)
    private Date validUntil;

    @Column(name = "minimum_order_amount", nullable = false)
    private BigDecimal minimumOrderAmount;

    @Column(name = "expiration_period")
    private Integer expirationPeriod;
}
