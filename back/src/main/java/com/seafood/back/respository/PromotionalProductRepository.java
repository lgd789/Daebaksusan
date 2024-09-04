package com.seafood.back.respository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.seafood.back.entity.PromotionalProductEntity;
import com.seafood.back.entity.PromotionalVideoEntity;


public interface PromotionalProductRepository extends JpaRepository<PromotionalProductEntity, Long>{

    List<PromotionalProductEntity> findByVideo(PromotionalVideoEntity video);
    
}
