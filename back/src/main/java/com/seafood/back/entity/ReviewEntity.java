package com.seafood.back.entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
import java.time.LocalDateTime;


@Table(name="reviews")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Entity
public class ReviewEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long reviewId;

    @Column(name = "product_id")
    private Long productId;
    
    @Column(name = "option_id")
    private Long optionId;

    // @Column(name = "member_id")
    // private String memberId; 

    @Column(name = "contents")
    private String contents;

    @Column(name = "score")
    private Integer score;

    @Column(name = "review_date")
    private LocalDateTime reviewDate;

    @Column(name = "is_best")
    private Boolean isBest;

    @Column(name = "order_number")
    private String orderNumber;

    @ManyToOne
    @JoinColumn(name = "member_id", referencedColumnName = "member_id", nullable = false)
    private MemberEntity member;
}    