package com.seafood.back.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.seafood.back.dto.AskQuestionDTO;
import com.seafood.back.dto.QnADTO;

public interface QnAService {
    public Page<QnADTO> getQnAByProductId(Long productId, int page, int pageSize);

    public void askQuestion(Long memberId, AskQuestionDTO askQuestionDTO);
}
