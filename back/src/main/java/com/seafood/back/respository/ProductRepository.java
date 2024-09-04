package com.seafood.back.respository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.seafood.back.entity.ProductEntity;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Long>{
    List<ProductEntity> findTop10ByOrderByProductIdDesc();
    List<ProductEntity> findByCategory(Long category);
    List<ProductEntity> findByNameContaining(String query);
    ProductEntity findByProductId(Long productId);
    List<ProductEntity> findAllByProductIdIn(List<Long> productIds);
    List<ProductEntity> findByRecommended(boolean b);
    List<ProductEntity> findByPopularity(boolean b);


}
