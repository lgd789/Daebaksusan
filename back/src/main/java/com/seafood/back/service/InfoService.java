package com.seafood.back.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.seafood.back.dto.MemberDTO;
import com.seafood.back.dto.MemberUpdateDTO;
import com.seafood.back.dto.PaymentDetailDTO;
import com.seafood.back.dto.ReviewCriteriaDTO;
import com.seafood.back.dto.ReviewDTO;

public interface InfoService {
    public MemberDTO getUserInfo(Long memberId);

    public Page<PaymentDetailDTO> getOrdertDetails(Long memberId, String status, int page, int size);
    public List<PaymentDetailDTO> getPaymentByOrderNumberAndPassword(String orderNumber, String password);


    // void saveReview(String id, ReviewRequestDTO reviewRequestDTO);

    public void saveReview(Long memberId, String orderNumber, Long productId, Long optionId, String contents, Integer score,
            MultipartFile[] imageFiles);

    public ReviewDTO getReviews(Long memberId, ReviewCriteriaDTO reviewCriteriaDTO);

    public void updateInfo(MemberUpdateDTO memberUpdateDTO);

}
