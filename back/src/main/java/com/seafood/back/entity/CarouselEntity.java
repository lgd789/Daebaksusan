package com.seafood.back.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "carousels")
@Getter @Setter
public class CarouselEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "carousel_id")
    private Long carouselId;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "link")
    private String link;
}