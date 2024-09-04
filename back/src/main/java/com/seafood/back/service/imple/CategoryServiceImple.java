package com.seafood.back.service.imple;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.seafood.back.dto.CategoryDTO;
import com.seafood.back.dto.CategoryDTO.SubcategoryDTO;
import com.seafood.back.entity.CategoryEntity;
import com.seafood.back.respository.CategoryRepository;
import com.seafood.back.service.CategoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImple implements CategoryService {
    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryDTO> getAllCategories() {
        List<CategoryDTO> categoryDTOs = new ArrayList<>();
        List<CategoryEntity> categoryEntities = categoryRepository.findAllWithSubcategories();
        for (CategoryEntity categoryEntity : categoryEntities) {
            if (categoryEntity.getCategoryId() == 1 || !categoryEntity.getSubcategories().isEmpty()) {
                CategoryDTO categoryDto = new CategoryDTO();
                categoryDto.setId(categoryEntity.getCategoryId());
                categoryDto.setName(categoryEntity.getName());
                categoryDto.setImageUrl(categoryEntity.getImageUrl());
                
                List<SubcategoryDTO> subcategoryDTOs = new ArrayList<>();
                List<CategoryEntity> subcategories = categoryEntity.getSubcategories();
                if (subcategories != null) {
                    for (CategoryEntity subcategoryEntity : categoryEntity.getSubcategories()) {
                        SubcategoryDTO subcategoryDTO = new SubcategoryDTO();
                        subcategoryDTO.setId(subcategoryEntity.getCategoryId());
                        subcategoryDTO.setName(subcategoryEntity.getName());
                        subcategoryDTOs.add(subcategoryDTO);
                    }
                }
                categoryDto.setSubcategories(subcategoryDTOs);
                categoryDTOs.add(categoryDto);
            }
        }
        return categoryDTOs;
    }
}
