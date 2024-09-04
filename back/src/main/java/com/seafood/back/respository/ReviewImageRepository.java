package com.seafood.back.respository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.seafood.back.entity.ReviewImageEntity;

public interface ReviewImageRepository extends JpaRepository<ReviewImageEntity, Long> {

    List<ReviewImageEntity> findByReviewId(Long reviewId);

    
}
