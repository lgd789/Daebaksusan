package com.seafood.back.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "video_products")
@Getter @Setter
public class PromotionalProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vp_id")
    private Long vpId;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "video_id")
    private PromotionalVideoEntity video;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private ProductEntity product;
}
