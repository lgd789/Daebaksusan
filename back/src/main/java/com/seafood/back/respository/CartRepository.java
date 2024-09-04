package com.seafood.back.respository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.seafood.back.entity.CartEntity;

@Repository
public interface CartRepository extends JpaRepository<CartEntity, Long> {
    List<CartEntity> findByMember_memberIdOrderByUpdatedAtDesc(Long memberId);
    void deleteByMember_memberIdAndCartIdIn(Long memberId, List<Long> cartItemIdsToDelete);
    CartEntity findByMember_memberIdAndProductIdAndOptionId(Long memberId, Long productId, Long optionId);
;
   

}