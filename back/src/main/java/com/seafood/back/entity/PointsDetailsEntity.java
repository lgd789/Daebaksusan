package com.seafood.back.entity;

import java.math.BigDecimal;

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
@Table(name = "points_details")
@Getter
@Setter
public class PointsDetailsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pt_id")
    private Long ptId;

    // @Column(name = "member_id")
    // private String memberId;

    @Column(name = "date")
    private Date date;

    @Column(name = "description")
    private String description;

    @Column(name = "usage_amount")
    private BigDecimal usageAmount;

    @Column(name = "sub_total")
    private BigDecimal subTotal;

    @ManyToOne(cascade = CascadeType.ALL) // or CascadeType.REMOVE if you only want delete cascade
    @JoinColumn(name = "member_id", referencedColumnName = "member_id", nullable = false)
    private MemberEntity member;
}
