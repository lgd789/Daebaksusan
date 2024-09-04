package com.seafood.back.dto;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class QuestionDTO {
    private Long questionId;
    private String question;
    private Date createdAt;
    private String name;
}
