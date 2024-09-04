package com.seafood.back.respository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.seafood.back.entity.CategoryEntity;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
    List<CategoryEntity> findByParentCategoryIsNull();

    CategoryEntity findByName(String name);

        
    @Query("SELECT c FROM CategoryEntity c LEFT JOIN FETCH c.subcategories")
    List<CategoryEntity> findAllWithSubcategories();
}