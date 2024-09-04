package com.seafood.back.respository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.seafood.back.entity.CarouselEntity;

public interface CarouselsRepository extends JpaRepository<CarouselEntity, Long> {
    
}