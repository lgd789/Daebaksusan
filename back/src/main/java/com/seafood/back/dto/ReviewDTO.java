package com.seafood.back.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewDTO {
    String contents;
    Integer score;
    String reviewDate;
    Boolean isBest;

    String name;
    
    String productName;

    String optionName;

    List<String> imageUrls;

    List<ReviewResponseDTO> responses;

}
