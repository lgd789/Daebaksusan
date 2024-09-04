package com.seafood.back.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@Entity
@Table(name = "payment_details")
@Getter @Setter
public class PaymentDetailsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_detail_id")
    private Long paymentDetailId;

    @Column(name = "order_number")
    private String orderNumber;

    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "imp_uid")
    private String impUid;

    @Column(name = "mid")
    private String mid;

    @Column(name = "is_cancel")
    private Boolean isCancel;

    @Column(name = "password")
    private String password;
    
    @Column(name = "order_date")
    private Date orderDate;

    @Column(name = "status")
    private String status;
}
