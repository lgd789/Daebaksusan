package com.seafood.back.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewResponseDTO {
    private String name;
    private String responseText;
    private String responseDate;
}
