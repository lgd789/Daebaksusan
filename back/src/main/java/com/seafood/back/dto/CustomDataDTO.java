package com.seafood.back.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CustomDataDTO {
    private CartDTO orderItems;
    private String userId;   
}
