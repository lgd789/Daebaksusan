package com.seafood.back.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.seafood.back.dto.ReviewDTO;
import com.seafood.back.dto.ReviewStatsDTO;
import com.seafood.back.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/{productId}")
    public ResponseEntity<Page<ReviewDTO>> findReviews(@PathVariable Long productId,
                                                        @RequestParam(defaultValue = "1") int page,
                                                        @RequestParam(defaultValue = "10") int pageSize) {
        Page<ReviewDTO> reviews = reviewService.findReviews(productId, page, pageSize);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @GetMapping("/stats/{productId}")
    public ResponseEntity<ReviewStatsDTO> getProductReviewStats(@PathVariable("productId") Long productId) {
        ReviewStatsDTO reviewStats = reviewService.getProductReviewStats(productId);
        return ResponseEntity.ok(reviewStats);
    }
}
