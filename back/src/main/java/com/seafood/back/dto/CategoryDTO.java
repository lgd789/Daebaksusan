package com.seafood.back.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class CategoryDTO {
    private Long id;
    private String name;
    private String imageUrl;
    private List<SubcategoryDTO> subcategories;

    @Getter
    @Setter
    public static class SubcategoryDTO {
        private Long id;
        private String name;
        
    }
}
