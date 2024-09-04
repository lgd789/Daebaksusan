package com.seafood.back.entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import java.time.LocalDateTime;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Table(name="review_response")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Entity
public class ReviewResponseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "response_id")
    private Long responseId;

    @Column(name = "review_id")
    private Long reviewId;
    
    // @Column(name = "admin_id")
    // private Integer adminId;

    @Column(name = "response_text")
    private String responseText;

    @Column(name = "response_date")
    private LocalDateTime responseDate;

    @ManyToOne(cascade = CascadeType.ALL) // or CascadeType.REMOVE if you only want delete cascade
    @JoinColumn(name = "admin_id", referencedColumnName = "member_id", nullable = false)
    private MemberEntity member;
}