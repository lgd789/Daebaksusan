package com.seafood.back.respository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.seafood.back.dto.ReviewStatsDTO;
import com.seafood.back.entity.ReviewEntity;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {

        List<ReviewEntity> findByProductId(Long productId);

        Page<ReviewEntity> findByProductId(Long productId, Pageable pageable);

        Page<ReviewEntity> findByMember_memberIdOrderByReviewDateDesc(Long memberId, Pageable pageable);

        boolean existsByProductIdAndOptionIdAndMember_memberIdAndOrderNumber(Long productId, Long optionId,
                        Long memberId,
                        String orderNumber);

        ReviewEntity findByProductIdAndOptionIdAndMember_memberIdAndOrderNumber(Long productId, Long optionId,
                        Long memberId,
                        String orderNumber);

        @Query("SELECT new com.seafood.back.dto.ReviewStatsDTO(" +
                        "AVG(r.score) AS avgScore, " +
                        "COUNT(r.score) AS totalReviews, " +
                        "SUM(CASE WHEN r.score = 5 THEN 1 ELSE 0 END) AS fiveStars, " +
                        "SUM(CASE WHEN r.score = 4 THEN 1 ELSE 0 END) AS fourStars, " +
                        "SUM(CASE WHEN r.score = 3 THEN 1 ELSE 0 END) AS threeStars, " +
                        "SUM(CASE WHEN r.score = 2 THEN 1 ELSE 0 END) AS twoStars, " +
                        "SUM(CASE WHEN r.score = 1 THEN 1 ELSE 0 END) AS oneStar) " +
                        "FROM ReviewEntity r " +
                        "WHERE r.productId = :productId " +
                        "GROUP BY r.productId")
        ReviewStatsDTO getProductReviewStats(Long productId);

}
