package com.seafood.back.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.seafood.back.dto.MemberDTO;
import com.seafood.back.dto.MemberUpdateDTO;
import com.seafood.back.dto.PaymentDetailDTO;
import com.seafood.back.dto.ReviewCriteriaDTO;
import com.seafood.back.dto.ReviewDTO;
import com.seafood.back.service.InfoService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/info")
public class InfoController {

    private final InfoService infoService;

    @GetMapping
    public ResponseEntity<MemberDTO> myPage(Authentication authentication) {
        Long memberId = Long.parseLong(authentication.getName());
        MemberDTO userInfo = infoService.getUserInfo(memberId);

        return ResponseEntity.ok().body(userInfo);
    }

    @GetMapping("/orderDetails")
    public ResponseEntity<?> getOrderDetails(Authentication authentication,
                                               @RequestParam(defaultValue = "1") int page,
                                               @RequestParam(defaultValue = "10") int pageSize,
                                               @RequestParam String status) {
        try {
            Long memberId = Long.parseLong(authentication.getName());
            Page<PaymentDetailDTO> paymentDetails = infoService.getOrdertDetails(memberId, status, page, pageSize);
            return ResponseEntity.ok().body(paymentDetails);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/reviewSave")
    public ResponseEntity<?> saveReview(Authentication authentication,
                                        @RequestParam("orderNumber") String orderNumber,
                                        @RequestParam("productId") Long productId,
                                        @RequestParam(name = "optionId", required = false) Long optionId,
                                        @RequestParam("contents") String contents,
                                        @RequestParam("score") Integer score,
                                        @RequestParam(value = "imageFiles", required = false) MultipartFile[] imageFiles)
{
        try {
            Long memberId = Long.parseLong(authentication.getName());
            infoService.saveReview(memberId, orderNumber, productId, optionId, contents, score, imageFiles);
    
            return ResponseEntity.ok().body("성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("실패");
        }
    }
    
    @PostMapping("/reviews")
    public ResponseEntity<?> getReviews(Authentication authentication,
                                        @RequestBody ReviewCriteriaDTO reviewCriteriaDTO) {
        try {
            Long memberId = Long.parseLong(authentication.getName());
            log.info(reviewCriteriaDTO.getOrderNumber());
            ReviewDTO reviewDTO = infoService.getReviews(memberId, reviewCriteriaDTO);
            return ResponseEntity.ok().body(reviewDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("실패");
        }
    }

    @PostMapping("/updateInfo")
    public ResponseEntity<?> updateInfo(Authentication authentication, @RequestBody MemberUpdateDTO memberUpdateDTO) {
        try {
            Long memberId = Long.parseLong(authentication.getName());
            memberUpdateDTO.setMemberId(memberId);
            infoService.updateInfo(memberUpdateDTO);
            return ResponseEntity.ok().body("s");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    

}
