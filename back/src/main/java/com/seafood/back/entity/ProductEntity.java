package com.seafood.back.entity;

import java.math.BigDecimal;
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
@Table(name = "products")
@Getter
@Setter
public class ProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    @Column(name = "category")
    private Integer category;

    @Column(name = "name")
    private String name;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    @Column(name = "regular_price")
    private BigDecimal regularPrice;

    @Column(name = "sale_price")
    private BigDecimal salePrice;

    @Column(name = "shipping_cost")
    private BigDecimal shippingCost;

    @Column(name = "description")
    private String description;

    @Column(name = "arrival_date")
    private Date arrivalDate;

    @Column(name = "recommended")
    private Boolean recommended;

    @Column(name = "popularity")
    private Boolean popularity;

    @Column(name = "max_quantity_per_delivery")
    private Integer maxQuantityPerDelivery;
    
}