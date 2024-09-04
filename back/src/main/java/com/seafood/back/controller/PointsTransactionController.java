package com.seafood.back.controller;

import com.seafood.back.entity.PointsDetailsEntity;
import com.seafood.back.service.PointsTransactionService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/points")
@RequiredArgsConstructor
public class PointsTransactionController {

   
    private final PointsTransactionService pointsTransactionService;

    @GetMapping("/getPointsDetails")
    public ResponseEntity<?> getAllTransactions(Authentication authentication,
                                                                        @RequestParam(defaultValue = "1") int page,
                                                                        @RequestParam(defaultValue = "10") int pageSize) {
        try {                                                                
            Long memberId = Long.parseLong(authentication.getName());

            Page<PointsDetailsEntity> transactions = pointsTransactionService.getAllTransactions(memberId, page, pageSize);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // @PostMapping("/create")
    // public ResponseEntity<PointsDetailsEntity> createTransaction(Authentication authentication) {
    //     String id = authentication.getName();

    //     PointsDetailsEntity createdTransaction = pointsTransactionService.createTransaction(id);
    //     return ResponseEntity.status(HttpStatus.CREATED).body(createdTransaction);
    // }

    
}
