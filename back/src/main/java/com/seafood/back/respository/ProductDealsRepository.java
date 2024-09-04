package com.seafood.back.respository;

import com.seafood.back.entity.ProductDealsEntity;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductDealsRepository extends JpaRepository<ProductDealsEntity, Long> {

    List<ProductDealsEntity> findByStartDateBeforeAndEndDateAfter(Date now, Date now2);
    // 추가적인 메서드가 필요한 경우 여기에 작성할 수 있습니다.
    
}
