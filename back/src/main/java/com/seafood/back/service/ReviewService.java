package com.seafood.back.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.seafood.back.dto.ReviewDTO;
import com.seafood.back.dto.ReviewStatsDTO;


public interface ReviewService {
    public Page<ReviewDTO> findReviews(Long productId, int page, int size );

    public ReviewStatsDTO getProductReviewStats(Long productId);
}
