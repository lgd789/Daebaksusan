package com.seafood.back.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ReviewCriteriaDTO {
    private Long productId;
    private Long optionId;
    private String orderNumber;
}
