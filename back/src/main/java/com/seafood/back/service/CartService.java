package com.seafood.back.service;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.seafood.back.dto.CartDTO;
import com.seafood.back.entity.CartEntity;

public interface CartService {
    public List<CartDTO> getCartItemsForMember(Long memberId);
    public void deleteSelectedCartItems(Long memberId, List<Long> cartItemIdsToDelete);
    ResponseEntity<?> saveCartItems(Long memberId, CartEntity[] cartItems);
    public CartEntity addToCart(Long memberId, Long productId, Long optionId, Integer quantity, Integer boxCnt);
}
