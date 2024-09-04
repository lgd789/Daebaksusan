package com.seafood.back.service.imple;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import java.math.BigDecimal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.seafood.back.dto.CouponDTO;
import com.seafood.back.dto.MemberDTO;
import com.seafood.back.dto.MemberUpdateDTO;
import com.seafood.back.dto.PaymentDetailDTO;
import com.seafood.back.dto.PaymentItemDTO;
import com.seafood.back.dto.PaymentStatusCountDTO;
import com.seafood.back.dto.ReviewCriteriaDTO;
import com.seafood.back.dto.ReviewDTO;

import com.seafood.back.dto.ReviewResponseDTO;

import com.seafood.back.entity.MemberEntity;
import com.seafood.back.entity.OptionEntity;
import com.seafood.back.entity.PaymentDetailsEntity;
import com.seafood.back.entity.ProductEntity;
import com.seafood.back.entity.ReviewEntity;
import com.seafood.back.entity.ReviewImageEntity;
import com.seafood.back.entity.ReviewResponseEntity;

import com.seafood.back.respository.MemberRepository;
import com.seafood.back.respository.OptionRepository;
import com.seafood.back.respository.PaymentDetailsRepository;
import com.seafood.back.respository.ProductRepository;
import com.seafood.back.respository.ReviewImageRepository;
import com.seafood.back.respository.ReviewRepository;
import com.seafood.back.respository.ReviewResponseRepository;
import com.seafood.back.service.CouponService;
import com.seafood.back.service.InfoService;
import com.seafood.back.service.MemberService;
import com.seafood.back.service.PointsTransactionService;
import com.seafood.back.service.S3Service;
// import com.seafood.back.service.S3Service;
import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class InfoServiceImple implements InfoService {

    private final MemberService memberService;
    private final PointsTransactionService pointsTransactionService;
    private final S3Service s3Service;

    private final MemberRepository memberRepository;
    private final PaymentDetailsRepository paymentDetailsRepository;
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final OptionRepository optionRepository;
    private final ReviewImageRepository reviewImageRepository;
    private final ReviewResponseRepository reviewResponseRepository;

    private final IamportClient iamportClient;

    private final PasswordEncoder passwordEncoder;

    @Override
    public MemberDTO getUserInfo(Long memberId) {
        MemberDTO memberDto = memberService.getMemberInfo(memberId);
        
        PaymentStatusCountDTO statusCounts = paymentDetailsRepository.countPaymentStatusByMemberId(memberId);

        // Set paymentStatusCounts in MemberDTO
        memberDto.setPaymentStatusCounts(statusCounts);

        return memberDto;
    }

    @Override
    public Page<PaymentDetailDTO> getOrdertDetails(Long memberId, String status, int page, int size) {
        System.out.println(status);
        // 페이지 번호를 0부터 시작하도록 수정
        Pageable pageable = PageRequest.of(page - 1, size);

        Page<PaymentDetailsEntity> paymentDetailsPage;
        if (status.equals("all")) {
            paymentDetailsPage = paymentDetailsRepository.findByMemberIdOrderByPaymentDetailIdDesc(memberId, pageable);
        } else {
            paymentDetailsPage = paymentDetailsRepository.findByMemberIdAndStatusOrderByPaymentDetailIdDesc(memberId, status, pageable);
        }

        // PaymentDetailDTO 리스트를 담을 리스트 생성
        List<PaymentDetailDTO> paymentDetailDTOs = new ArrayList<>();

        // 페이지네이션된 데이터를 PaymentDetailDTO로 변환하여 리스트에 추가
        for (PaymentDetailsEntity paymentDetail : paymentDetailsPage.getContent()) {
            try {
                PaymentDetailDTO paymentDetailDTO = new PaymentDetailDTO();

                IamportResponse<Payment> iamportResponse = iamportClient.paymentByImpUid(paymentDetail.getImpUid());
                paymentDetail.setStatus(iamportResponse.getResponse().getStatus());
                paymentDetailsRepository.save(paymentDetail);

                List<PaymentItemDTO> orderItems = extractOrderItems(iamportResponse);

                // for (PaymentItemDTO item : orderItems) {
                // item.setIsReview(true);
                // }

                for (PaymentItemDTO item : orderItems) {
                    boolean isReview = reviewRepository.existsByProductIdAndOptionIdAndMember_memberIdAndOrderNumber(
                            item.getCartItem().getProduct().getProductId(),
                            item.getCartItem().getOption().getOptionId(), memberId,
                            paymentDetail.getOrderNumber());

                    item.setIsReview(isReview);
                }

                paymentDetailDTO.setOrderNumber(paymentDetail.getOrderNumber());
                paymentDetailDTO.setOrderItems(orderItems);
                paymentDetailDTO.setStatus(iamportResponse.getResponse().getStatus());

                paymentDetailDTO.setOrderDate(paymentDetail.getOrderDate());
                log.info(paymentDetailDTO.getOrderDate().toString());
                paymentDetailDTOs.add(paymentDetailDTO);
            } catch (IamportResponseException | IOException e) {
                // 예외 발생 시 처리
                e.printStackTrace();
            }
        }

        return new PageImpl<>(paymentDetailDTOs, pageable, paymentDetailsPage.getTotalElements());
    }

    @Override
    public List<PaymentDetailDTO> getPaymentByOrderNumberAndPassword(String orderNumber, String password) {
        PaymentDetailsEntity paymentDetail = paymentDetailsRepository.findByOrderNumber(orderNumber);

        if (paymentDetail == null || paymentDetail.getMemberId() != null
                || !passwordEncoder.matches(password, paymentDetail.getPassword())) {
            throw new RuntimeException("주문 정보를 찾을 수 없습니다.");
        }

        List<PaymentDetailDTO> paymentDetailDTOs = new ArrayList<>();

        try {
            PaymentDetailDTO paymentDetailDTO = new PaymentDetailDTO();

            IamportResponse<Payment> iamportResponse = iamportClient.paymentByImpUid(paymentDetail.getImpUid());

            List<PaymentItemDTO> orderItems = extractOrderItems(iamportResponse);

            paymentDetailDTO.setOrderNumber(paymentDetail.getOrderNumber());
            paymentDetailDTO.setOrderItems(orderItems);
            paymentDetailDTO.setStatus(iamportResponse.getResponse().getStatus());

            paymentDetailDTOs.add(paymentDetailDTO);

            return paymentDetailDTOs;
        } catch (IamportResponseException | IOException e) {
            // 예외 발생 시 처리
            e.printStackTrace();
        }
        return null;

    }

    private List<PaymentItemDTO> extractOrderItems(IamportResponse<Payment> iamportResponse)
            throws IamportResponseException, IOException {

        // JSON 문자열 파싱하여 Map 객체로 변환
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap = objectMapper.readValue(iamportResponse.getResponse().getCustomData(),
                new TypeReference<Map<String, Object>>() {
                });

        List<PaymentItemDTO> orderItems = objectMapper.convertValue(jsonMap.get("orderItems"),
                new TypeReference<List<PaymentItemDTO>>() {
                });

        return orderItems;
    }

    @Transactional
    public void saveReview(Long memberId, String orderNumber, Long productId, Long optionId, String contents,
            Integer score,
            MultipartFile[] imageFiles) {
        MemberEntity member = memberRepository.findByMemberId(memberId);

        ReviewEntity reviewEntity = new ReviewEntity();
        reviewEntity.setMember(member);
        reviewEntity.setOrderNumber(orderNumber);
        reviewEntity.setProductId(productId);
        reviewEntity.setOptionId(optionId);
        reviewEntity.setContents(contents);
        reviewEntity.setScore(score);
        reviewEntity.setReviewDate(LocalDateTime.now());
        reviewEntity.setIsBest(false); // 기본값으로 false 설정

        ReviewEntity savedReviewEntity = reviewRepository.save(reviewEntity);

        if (imageFiles != null) { // null 체크 추가
            for (MultipartFile imageFile : imageFiles) {
                if (imageFile != null && !imageFile.isEmpty()) { // null 및 비어있는지 체크
                    // try {
                    //     String fileName = "review/" + savedReviewEntity.getReviewId() + "_" + index;
                    //     String imageUrl = s3Service.saveImageToS3(imageFile, fileName);
                    //     index++;

                    //     reviewImageEntity.setImageUrl(imageUrl);
                    //     reviewImageRepository.save(reviewImageEntity);
                    // } catch (IOException e) {

                    //     e.printStackTrace();
                    // }
                    try {
                        ReviewImageEntity reviewImageEntity = new ReviewImageEntity();
                        reviewImageEntity.setReviewId(savedReviewEntity.getReviewId());
                        
                        String imageUrl = s3Service.saveImageToS3(imageFile, "reivew/");
                        reviewImageEntity.setImageUrl(imageUrl);
                        reviewImageRepository.save(reviewImageEntity);
                    } catch (IOException e) {

                    }

                }
            }
        }
        String description;
        BigDecimal usageAmount;

        if (imageFiles == null) {
            description = "리뷰 작성";
            usageAmount = BigDecimal.valueOf(500);
        } else {
            description = "포토 리뷰 작성";
            usageAmount = BigDecimal.valueOf(1000);
        }

        BigDecimal subTotal = memberService.deductPoints(memberId, usageAmount.negate());
        pointsTransactionService.createTransaction(memberId, description, usageAmount, subTotal);

    }

    // private String saveImage(MultipartFile imageFile, Long reviewId, int index)
    // throws IOException {
    // // String oriFileName =
    // StringUtils.cleanPath(imageFile.getOriginalFilename());

    // // String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new
    // Date());
    // String fileName = reviewId + "_" + index + ".jpg";
    // Path uploadDir = Paths.get("/home/ubuntu/build/review");

    // // 업로드 디렉토리가 존재하지 않으면 생성합니다.
    // if (!Files.exists(uploadDir)) {
    // Files.createDirectories(uploadDir);
    // }

    // // 파일을 업로드 디렉토리에 저장합니다.
    // try {
    // Path filePath = uploadDir.resolve(fileName);
    // Files.copy(imageFile.getInputStream(), filePath);
    // return fileName;
    // } catch (IOException ex) {
    // throw new IOException("이미지를 저장하는 중에 오류가 발생했습니다.", ex);
    // }
    // }

    @Override
    public ReviewDTO getReviews(Long memberId, ReviewCriteriaDTO reviewCriteriaDTO) {
        ReviewEntity reviewEntity = reviewRepository.findByProductIdAndOptionIdAndMember_memberIdAndOrderNumber(
                reviewCriteriaDTO.getProductId(), reviewCriteriaDTO.getOptionId(), memberId,
                reviewCriteriaDTO.getOrderNumber());

        ReviewDTO reviewDTO = new ReviewDTO();

        log.info(reviewEntity.getReviewId().toString());
        reviewDTO.setContents(reviewEntity.getContents());
        reviewDTO.setScore(reviewEntity.getScore());
        reviewDTO.setReviewDate(reviewEntity.getReviewDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        reviewDTO.setIsBest(reviewEntity.getIsBest());

        String name = reviewEntity.getMember().getName();
        reviewDTO.setName(name);

        ProductEntity productEntity = productRepository.findByProductId(reviewEntity.getProductId());
        reviewDTO.setProductName(productEntity.getName());

        Long optionId = reviewEntity.getOptionId();

        OptionEntity optionEntity = optionRepository.findByOptionId(optionId);
        reviewDTO.setOptionName(optionEntity.getName());

        Long reviewId = reviewEntity.getReviewId();

        List<ReviewImageEntity> reviewImageEntities = reviewImageRepository.findByReviewId(reviewId);
        List<String> imageUrls = new ArrayList<String>();

        for (ReviewImageEntity reviewImageEntity : reviewImageEntities) {
            // 이미지의 key를 가져옴
            String imageKey = reviewImageEntity.getImageUrl();
            imageUrls.add(imageKey);
            // try {
            //     // S3에 저장된 이미지의 URL을 가져옴
            //     String imageUrl = s3Service.getImageUrl(imageKey);
            //     imageUrls.add(imageUrl);
            // } catch (IOException e) {
            //     // 이미지 URL을 가져오는 중에 오류가 발생한 경우
            //     e.printStackTrace();
            //     // 처리할 방법에 따라 예외 처리를 추가하십시오.
            // }
        }
        reviewDTO.setImageUrls(imageUrls);

        List<ReviewResponseDTO> reviewResponseDTOs = new ArrayList<ReviewResponseDTO>();
        List<ReviewResponseEntity> reviewResponseEntities = reviewResponseRepository.findByReviewId(reviewId);
        for (ReviewResponseEntity reviewResponseEntity : reviewResponseEntities) {
            ReviewResponseDTO reviewResponseDTO = new ReviewResponseDTO();

            // int adminId = reviewResponseEntity.getAdminId();
            // reviewResponseDTO.setName(memberRepository.findByMemberId(adminId).getName());
            reviewResponseDTO.setName(reviewResponseEntity.getMember().getName());
            reviewResponseDTO.setResponseText(reviewResponseEntity.getResponseText());
            reviewResponseDTO.setResponseDate(
                    reviewResponseEntity.getResponseDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));

            reviewResponseDTOs.add(reviewResponseDTO);
        }
        reviewDTO.setResponses(reviewResponseDTOs);

        return reviewDTO;
    }

    @Override
    public void updateInfo(MemberUpdateDTO memberUpdateDTO) {
        memberService.updateMember(memberUpdateDTO);
    }
}