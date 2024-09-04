package com.seafood.back.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentAndOrderInfo {
    private String orderNumber;
    private Long orderAt;
    private String productName;
    private String name;
    private String postCode;
    private String address;
    private String phone;

    private Date paymentAt;
    private String paymentStatus;
    private String paymentMethod;
    private String pgProvider;
    private String payerName;
    private BigDecimal amount;
    
    private String cardName;
    private Integer installmentMonths;
    private String bankName;
    private String cardNumber;
    
    // 무통장입금 관련 추가 정보
    private String vbankName;
    private String vbankNum;
    private String vbankHolder;
    private Long vbanIssuedAt;
   

    // 계좌이체 관련 추가 정보
    private String bankNum;
    private String bankHolder;

    private CouponDTO coupon;
    private BigDecimal points;

}