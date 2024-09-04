package com.seafood.back.respository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.seafood.back.entity.ReviewResponseEntity;

public interface ReviewResponseRepository extends JpaRepository<ReviewResponseEntity, Long> {

    List<ReviewResponseEntity> findByReviewId(Long reviewId);
    
}
