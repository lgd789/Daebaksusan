package com.seafood.back.dto;

import java.util.List;
import java.util.stream.Collectors;

import com.seafood.back.entity.PromotionalVideoEntity;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class VideoDTO {
    private Long videoId;
    private String videoUrl;
    private String link;
    private List<ProductDTO> products;
}
