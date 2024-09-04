package com.seafood.back.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "member_coupon")
@Getter
@Setter
public class MemberCouponEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    // @Column(name = "member_id", nullable = false)
    // private String memberId;


    @ManyToOne
    @JoinColumn(name = "coupon_id", referencedColumnName = "coupon_id")
    private CouponEntity coupon;

    @Column(name = "issue_date", nullable = false)
    private Date issueDate;

    @Column(name = "valid_until", nullable = false)
    private Date validUntil;

    @ManyToOne
    @JoinColumn(name = "member_id", referencedColumnName = "member_id", nullable = false)
    private MemberEntity member;
}
