package com.seafood.back.dto;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AnswerDTO {
    private Long answerId;
    private String content;
    private Date createdAt;
}
