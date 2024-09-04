package com.seafood.back.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewRequestDTO {
    Long productId;
    Long optionId;
    String contents;
    Integer score;
    MultipartFile[] imageFiles;
}
