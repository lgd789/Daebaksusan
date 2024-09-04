package com.seafood.back.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class PaymentItemDTO extends CartDTO{
    Boolean isReview;
}
