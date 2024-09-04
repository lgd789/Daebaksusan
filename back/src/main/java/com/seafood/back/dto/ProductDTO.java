package com.seafood.back.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDTO {

    Long productId;
    Integer category;
    String name;
    String imageUrl;
    Integer stockQuantity;
    BigDecimal regularPrice;
    BigDecimal salePrice;
    BigDecimal shippingCost;
    String description;
    Date arrivalDate;
    Boolean recommended;
    Boolean popularity;
    Integer maxQuantityPerDelivery;
    Date startDate;
    Date endDate;

    
}
