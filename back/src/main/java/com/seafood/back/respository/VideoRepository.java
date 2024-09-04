package com.seafood.back.respository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.seafood.back.entity.PromotionalVideoEntity;

public interface VideoRepository extends JpaRepository<PromotionalVideoEntity, Long>{

    PromotionalVideoEntity findFirstByOrderByVideoId();
    
}
