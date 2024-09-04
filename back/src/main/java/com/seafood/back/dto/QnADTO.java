package com.seafood.back.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
@Getter @Setter
public class QnADTO {
    private QuestionDTO question;
    private List<AnswerDTO> answers;

}
