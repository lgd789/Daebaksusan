package com.seafood.back.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seafood.back.dto.CartDTO;
import com.seafood.back.entity.CartEntity;
import com.seafood.back.service.CartService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {
    
    private final CartService cartService;

    @GetMapping("/get")
    public List<CartDTO> getCartItemsForMember(Authentication authentication) {
        Long memberId = Long.parseLong(authentication.getName());
        
        return cartService.getCartItemsForMember(memberId);
    }

    @PostMapping("/delete")
    public ResponseEntity<?> deleteSelectedCartItems(@RequestBody List<Long> cartItemIdsToDelete, Authentication authentication) {
        try { 
            if (cartItemIdsToDelete == null) {
                throw new IllegalArgumentException("cartItemIdsToDelete cannot be null");
            }
            
            Long memberId = Long.parseLong(authentication.getName());
            cartService.deleteSelectedCartItems(memberId, cartItemIdsToDelete);
            return ResponseEntity.ok("Selected cart items deleted successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting selected cart items.");
        }
    }

    @PostMapping("/cookieSave")
    public ResponseEntity<?> saveCartItems(@RequestBody CartEntity[] cartItems, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        Long memberId = Long.parseLong(authentication.getName());
        return  cartService.saveCartItems(memberId, cartItems);
    }

    @PostMapping("/cartSave")
    public ResponseEntity<?> addToCart(@RequestBody CartEntity cart, Authentication authentication) {
        try {
            Long memberId = Long.parseLong(authentication.getName());
            CartEntity saveCart = cartService.addToCart(memberId, cart.getProductId(), cart.getOptionId(), cart.getQuantity(), cart.getBoxCnt());

            if (saveCart != null) {
                return ResponseEntity.ok().body(saveCart);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        } catch (IllegalArgumentException e) {
            log.info("재고초과");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("재고를 초과했습니다.");
        } 
    }
}
