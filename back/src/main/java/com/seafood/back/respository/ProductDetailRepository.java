package com.seafood.back.respository;

import com.seafood.back.entity.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductDetailRepository extends JpaRepository<ProductDetail, Long> {
    ProductDetail findByProductId(Long productId);
}
