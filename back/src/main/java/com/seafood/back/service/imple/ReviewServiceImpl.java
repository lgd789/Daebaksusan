package com.seafood.back.service.imple;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.seafood.back.dto.ReviewDTO;
import com.seafood.back.dto.ReviewResponseDTO;
import com.seafood.back.dto.ReviewStatsDTO;
import com.seafood.back.entity.MemberEntity;
import com.seafood.back.entity.OptionEntity;
import com.seafood.back.entity.ProductEntity;
import com.seafood.back.entity.ReviewEntity;
import com.seafood.back.entity.ReviewImageEntity;
import com.seafood.back.entity.ReviewResponseEntity;
import com.seafood.back.respository.MemberRepository;
import com.seafood.back.respository.OptionRepository;
import com.seafood.back.respository.ProductRepository;
import com.seafood.back.respository.ReviewImageRepository;
import com.seafood.back.respository.ReviewRepository;
import com.seafood.back.respository.ReviewResponseRepository;
import com.seafood.back.service.ReviewService;
import com.seafood.back.service.S3Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService{
    private final S3Service s3Service;

    private final ReviewRepository reviewRepository;
    private final MemberRepository memberRepository;
    private final ProductRepository productRepository;
    private final OptionRepository optionRepository;
    private final ReviewImageRepository reviewImageRepository;
    private final ReviewResponseRepository reviewResponseRepository;

    @Override
    public Page<ReviewDTO> findReviews(Long productId, int page, int size ) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<ReviewEntity> reviewEntities = reviewRepository.findByProductId(productId, pageable);

        List<ReviewDTO> reviewDTOs = new ArrayList<>();
        
        for(ReviewEntity reviewEntity : reviewEntities.getContent() ) {
            ReviewDTO reviewDTO = new ReviewDTO();

            reviewDTO.setContents(reviewEntity.getContents());
            reviewDTO.setScore(reviewEntity.getScore());
            reviewDTO.setReviewDate(reviewEntity.getReviewDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
            reviewDTO.setIsBest(reviewEntity.getIsBest());

            
            String name = reviewEntity.getMember().getName();
            
            // 이름이 2글자 이상인 경우에만 가운데를 별표로 대체
            if (name.length() >= 3) {
                StringBuilder maskedNameBuilder = new StringBuilder(name);
                for (int i = 1; i < name.length() - 1; i++) {
                    maskedNameBuilder.setCharAt(i, '*');
                }
                reviewDTO.setName(maskedNameBuilder.toString());
            } else if (name.length() == 2) {
                StringBuilder maskedNameBuilder = new StringBuilder(name);
                maskedNameBuilder.setCharAt(name.length() - 1, '*');
                reviewDTO.setName(maskedNameBuilder.toString());
            } else {
                reviewDTO.setName(name);
            }
            
            

            ProductEntity productEntity = productRepository.findByProductId(productId);
            reviewDTO.setProductName(productEntity.getName());

            Long optionId = reviewEntity.getOptionId();

            OptionEntity optionEntity = optionRepository.findByOptionId(optionId);
            reviewDTO.setOptionName(optionEntity.getName());

            Long reviewId = reviewEntity.getReviewId();

            List<ReviewImageEntity> reviewImageEntities = reviewImageRepository.findByReviewId(reviewId);
            List<String> imageUrls = new ArrayList<String>();
            
            for (ReviewImageEntity reviewImageEntity : reviewImageEntities) {
                imageUrls.add(reviewImageEntity.getImageUrl());
                // // 이미지의 key를 가져옴
                // String imageKey = reviewImageEntity.getImageUrl();
                // // imageUrls.add(imageKey);
                // try {
                //     // S3에 저장된 이미지의 URL을 가져옴
                //     String imageUrl = s3Service.getImageUrl(imageKey);
                //     imageUrls.add(imageUrl);
                // } catch (IOException e) {
                //     e.printStackTrace();
                // }
            }
            reviewDTO.setImageUrls(imageUrls);

            
            List<ReviewResponseDTO> reviewResponseDTOs = new ArrayList<ReviewResponseDTO>();
            List<ReviewResponseEntity> reviewResponseEntities = reviewResponseRepository.findByReviewId(reviewId);
            for(ReviewResponseEntity reviewResponseEntity: reviewResponseEntities){
                ReviewResponseDTO reviewResponseDTO = new ReviewResponseDTO();

                // int adminId = reviewResponseEntity.getAdminId();
                // reviewResponseDTO.setName(memberRepository.findByMemberId(adminId).getName());
                reviewResponseDTO.setName(reviewResponseEntity.getMember().getName());
                reviewResponseDTO.setResponseText(reviewResponseEntity.getResponseText());
                reviewResponseDTO.setResponseDate(reviewResponseEntity.getResponseDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));

                reviewResponseDTOs.add(reviewResponseDTO);
            }
            reviewDTO.setResponses(reviewResponseDTOs);

            reviewDTOs.add(reviewDTO);
        }

        return new PageImpl<>(reviewDTOs, pageable, reviewEntities.getTotalElements());
    
    }

    @Override
    public ReviewStatsDTO getProductReviewStats(Long productId) {
        return reviewRepository.getProductReviewStats(productId);
    }
    
}
