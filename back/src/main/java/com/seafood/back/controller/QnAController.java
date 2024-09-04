package com.seafood.back.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.seafood.back.dto.AskQuestionDTO;
import com.seafood.back.dto.QnADTO;
import com.seafood.back.service.QnAService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/qna")
public class QnAController {

    private final QnAService qnaService;

    @GetMapping("/getQna")
    public ResponseEntity<?> getQnAByProductId(@RequestParam Long productId,
                                                            @RequestParam(defaultValue = "1") int page,
                                                            @RequestParam(defaultValue = "10") int pageSize) {
        try {
            Page<QnADTO> qnADTOs = qnaService.getQnAByProductId(productId, page, pageSize);
            return ResponseEntity.ok(qnADTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/ask")
    public ResponseEntity<?> askQuestion(Authentication authentication, @RequestBody AskQuestionDTO askQuestionDTO) {
        try {
            Long memberId = Long.parseLong(authentication.getName());
            qnaService.askQuestion(memberId, askQuestionDTO);
            return ResponseEntity.ok("Question submitted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while submitting the question.");
        }
    }
}
