package com.seafood.back.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AskQuestionDTO {
    private Long productId;
    private String questionText;
}
