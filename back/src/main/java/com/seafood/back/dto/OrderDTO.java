package com.seafood.back.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class OrderDTO {
    private Long cartId;
    private Long productId;
    private Integer optionId;
    private Integer quantity;
}
