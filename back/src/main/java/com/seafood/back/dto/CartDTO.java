package com.seafood.back.dto;


import lombok.Getter;
import lombok.Setter;


@Getter @Setter
public class CartDTO {
    private Long cartId;
    private CartItemDTO cartItem;
}
