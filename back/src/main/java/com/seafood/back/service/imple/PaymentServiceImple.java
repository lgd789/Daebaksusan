package com.seafood.back.service.imple;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.seafood.back.controller.MemberController;
import com.seafood.back.dto.CartDTO;
import com.seafood.back.dto.CouponAmountResult;
import com.seafood.back.dto.CouponDTO;
import com.seafood.back.dto.MemberDTO;
import com.seafood.back.dto.PaymentAndOrderInfo;
import com.seafood.back.dto.PaymentDetailDTO;
import com.seafood.back.dto.PaymentItemDTO;
import com.seafood.back.dto.ProductDTO;
import com.seafood.back.entity.MemberEntity;
import com.seafood.back.entity.OptionEntity;
import com.seafood.back.entity.PaymentDetailsEntity;
import com.seafood.back.entity.ProductDealsEntity;
import com.seafood.back.entity.ProductEntity;

import com.seafood.back.respository.OptionRepository;
import com.seafood.back.respository.PaymentDetailsRepository;
import com.seafood.back.respository.ProductRepository;
import com.seafood.back.service.CartService;
import com.seafood.back.service.CouponService;
import com.seafood.back.service.MemberService;
import com.seafood.back.service.PaymentService;
import com.seafood.back.service.PointsTransactionService;
import com.seafood.back.service.ProductService;
import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.request.CancelData;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImple implements PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentServiceImple.class);

    private final ProductService productService;
    private final CartService cartService;
    private final CouponService couponService;
    private final MemberService memberService;
    private final PointsTransactionService pointsTransactionService;

    private final IamportClient iamportClient;

    private final OptionRepository optionRepository;
    private final ProductRepository productRepository;
    private final PaymentDetailsRepository paymentDetailsRepository;

    private final PasswordEncoder passwordEncoder;

    @Transactional
    @Override
    public BigDecimal orderAmount(String imp_uid, List<CartDTO> orderItems) {
        BigDecimal sum = BigDecimal.ZERO;
        List<ProductDealsEntity> productDeals = productService.findProductDeal();

        for (CartDTO orderItem : orderItems) {
            Long productId = orderItem.getCartItem().getProduct().getProductId(); // 상품 ID
            Long optionId = orderItem.getCartItem().getOption().getOptionId(); // 옵션 ID

            // 상품과 옵션을 조회합니다.
            Optional<ProductEntity> productOptional = productRepository.findById(productId);
            Optional<OptionEntity> optionOptional = optionRepository.findById(optionId);

            // 상품과 옵션 정보가 존재할 경우, 가격을 더합니다.
            if (productOptional.isPresent() && optionOptional.isPresent()) {

                ProductEntity product = productOptional.get();
                ProductDTO productDTO = productService.convertToProductDTO(product, productDeals);

                OptionEntity option = optionOptional.get();

                // 주문된 상품의 수량체크
                int orderedQuantity = orderItem.getCartItem().getQuantity();
                int remainingStock = productDTO.getStockQuantity() - orderedQuantity;

                if (remainingStock < 0) {
                    logger.error("Order Item - Message: {}, ProductId: {}, ProductName: {}",
                             "주문 수량이 재고보다 많습니다",
                             productDTO.getProductId(),
                             productDTO.getName());
                    cancelPayment(imp_uid);
                    throw new IllegalArgumentException("주문 수량이 재고보다 많습니다. 상품명: " + productDTO.getName());
                }

                BigDecimal productPrice = productDTO.getRegularPrice().subtract(productDTO.getSalePrice());
                BigDecimal shippingCost = productDTO.getShippingCost();
                int maxQuantityPerDelivery = productDTO.getMaxQuantityPerDelivery();

                BigDecimal optionPrice = option.getAddPrice();
                int quantity = orderItem.getCartItem().getQuantity();
                int boxCnt = (int) Math.ceil((double) quantity / maxQuantityPerDelivery);

                BigDecimal productTotalPrice = productPrice.multiply(new BigDecimal(quantity));
                BigDecimal optionTotalPrice = optionPrice.add(shippingCost).multiply(new BigDecimal(boxCnt));

                sum = sum.add(productTotalPrice.add(optionTotalPrice));
            }

        }
        return sum;
    }

    @Transactional
    @Override
    public String savePaymentDetails(Long memberId, String impUid, String mid, String password, String status){
        try {
            PaymentDetailsEntity paymentDetails = new PaymentDetailsEntity();

            // 현재 날짜를 가져옴
            Date today = new Date();

            // 날짜 포맷 지정
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");

            // 현재 날짜를 문자열로 변환
            String currentDate = dateFormat.format(today);

            // 해당 날짜에 해당하는 주문번호들의 개수를 가져옴
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(today);
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);
            Date todayWithoutTime = calendar.getTime();

            int orderCountForToday = paymentDetailsRepository.getOrderCountForDate(todayWithoutTime);

            // 주문번호를 생성 (날짜 + 해당 날짜의 주문번호 개수)
            String orderNumber = currentDate + "_" + String.format("%08d", orderCountForToday + 1);

            if (memberId != null) {
                paymentDetails.setMemberId(memberId);
            }

            paymentDetails.setOrderNumber(orderNumber);
            paymentDetails.setImpUid(impUid);
            paymentDetails.setMid(mid);
            paymentDetails.setIsCancel(true);
            paymentDetails.setPassword(passwordEncoder.encode(password));
            paymentDetails.setOrderDate(todayWithoutTime); // 주문날짜 설정
            paymentDetails.setStatus(status);
            paymentDetailsRepository.save(paymentDetails);

            return orderNumber;
        } catch (Exception e) {
            // 기타 예외 처리
            throw new RuntimeException("주문 처리 중 오류가 발생했습니다.");
        }
    }

    @Transactional
    @Override
    public String processSuccessfulPayment(Long memberId, String id, List<CartDTO> orderItems, String impUid, String mid, String password, CouponDTO coupon, BigDecimal points, String status) {
        try {
            // 결제가 성공하면 상품 수량 변경
            productService.updateProductQuantities(orderItems);

            // 결제가 성공하면 카트 아이템 삭제
            if (memberId != null) {
                List<Long> cartItemIdsToDelete = orderItems.stream()
                        .map(CartDTO::getCartId)
                        .collect(Collectors.toList());

                
                cartService.deleteSelectedCartItems(memberId, cartItemIdsToDelete);

                if (points != BigDecimal.ZERO) {
                    
                    BigDecimal subTotal = memberService.deductPoints(memberId, points);
                    pointsTransactionService.createTransaction(memberId, "상품 구매", points.negate(), subTotal);
                }
            }
            // 결제 정보 저장
            String orderNumber = savePaymentDetails(memberId, impUid, mid, password, status);

            // 쿠폰 제거
            if (coupon != null) {
                couponService.removeCoupon(memberId, coupon.getId());
            }

            return orderNumber;
        } catch (Exception e) {
            logger.error("Order - Message: {}, ImpUid: {}", 
                        "결제 실패",
                        memberId,
                        id,
                        impUid);
            cancelPayment(impUid);
            throw new RuntimeException("Error processing successful payment", e);
        }
    }

    @Override
    public Map<String, Object> verifyAndProcessPayment(String imp_uid) throws Exception {
        IamportResponse<Payment> iamportResponse = iamportClient.paymentByImpUid(imp_uid);

        PaymentDetailsEntity paymentDetails = paymentDetailsRepository.findByImpUid(imp_uid);

        if (paymentDetails != null) {
            return null;
        }

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap = objectMapper.readValue(iamportResponse.getResponse().getCustomData(),
                new TypeReference<Map<String, Object>>() {
                });
        
        Number memberIdNumber = (Number) jsonMap.get("id");
        Long memberId = null;
        String id = null;
        if (memberIdNumber != null) {
            MemberDTO memberDto = memberService.getMemberInfo(memberIdNumber.longValue());
            
            memberId = memberDto.getMemberId();
            id = memberDto.getId();
        }
                
        List<CartDTO> orderItems = objectMapper.convertValue(jsonMap.get("orderItems"),
                new TypeReference<List<CartDTO>>() {
                });
        CouponDTO coupon = objectMapper.convertValue(jsonMap.get("coupon"),
                new TypeReference<CouponDTO>() {
                });

        BigDecimal points = objectMapper.convertValue(jsonMap.get("points"),
                new TypeReference<BigDecimal>() {
                });
        String password = objectMapper.convertValue(jsonMap.get("password"),
                new TypeReference<String>() {
                });

        BigDecimal paidAmount = iamportResponse.getResponse().getAmount();
        System.out.println(iamportResponse.getResponse().getStatus());
        BigDecimal orderAmount = orderAmount(imp_uid, orderItems);

        CouponAmountResult couponAmountResult = couponService.couponAmount(memberId, coupon);

        if (orderAmount.compareTo(couponAmountResult.getMinimumOrderAmount()) < 0) {
            logger.error("Order - Message: {}, ImpUid: {}", 
                        "주문 금액이 쿠폰의 최소 주문 금액을 충족하지 않습니다.",
                        memberId,
                        id,
                        imp_uid);
            cancelPayment(imp_uid);
            throw new IllegalArgumentException("주문 금액이 쿠폰의 최소 주문 금액을 충족하지 않습니다.");
        }

        BigDecimal pointsUsed = BigDecimal.ZERO;
        if (points != BigDecimal.ZERO) {
            pointsUsed = points;
            BigDecimal availablePoint = memberService.getAvailablePoints(memberId);
            if (points.compareTo(availablePoint) > 0) {
                logger.error("Order - Message: {}, ImpUid: {}", 
                        "사용 가능한 포인트보다 더 많은 포인트를 사용하려고 합니다.",
                        memberId,
                        id,
                        imp_uid);
                cancelPayment(imp_uid);
                throw new IllegalArgumentException("사용 가능한 포인트보다 더 많은 포인트를 사용하려고 합니다.");
            }
        }

        BigDecimal expectedAmount = orderAmount.subtract(couponAmountResult.getCouponAmount()).subtract(pointsUsed);

        if (expectedAmount.compareTo(paidAmount) == 0) {
            String mid = iamportResponse.getResponse().getMerchantUid();
            String status = iamportResponse.getResponse().getStatus();
            String orderNumber = processSuccessfulPayment(memberId, id, orderItems, imp_uid, mid, password, coupon, pointsUsed, status);
            
            for (CartDTO item : orderItems) {
                int quantity = item.getCartItem().getQuantity();
                BigDecimal regularPrice = item.getCartItem().getProduct().getRegularPrice();
                BigDecimal salePrice = item.getCartItem().getProduct().getSalePrice();
                BigDecimal optionPrice = item.getCartItem().getOption().getAddPrice();
                BigDecimal shippingCost = item.getCartItem().getProduct().getShippingCost();
            
                BigDecimal pricePerUnit = regularPrice.subtract(salePrice);
                BigDecimal totalPricePerUnit = pricePerUnit.add(optionPrice);
                BigDecimal totalAmount = totalPricePerUnit.multiply(BigDecimal.valueOf(quantity));
            
                int boxCnt = item.getCartItem().getBoxCnt();
            
                BigDecimal optionTotalPrice = optionPrice.multiply(BigDecimal.valueOf(boxCnt));
                BigDecimal shippingTotalCost = shippingCost.multiply(BigDecimal.valueOf(boxCnt));
            
                totalAmount = totalAmount.add(optionTotalPrice).add(shippingTotalCost);
            
                logger.info("Order Item - Message: {}, OrderNumber: {}, ProductId: {}, ProductName: {}, Quantity: {}, Amount: {}",
                            "주문 항목 처리",
                            orderNumber,
                            item.getCartItem().getProduct().getProductId(),
                            item.getCartItem().getProduct().getName(),
                            quantity,
                            totalAmount );
            }
            logger.info("Order - Message: {}, MemberId: {}, Id: {}, OrderNumber: {}, ImpUid: {}", 
                        "결제 성공",
                        memberId,
                        id,
                        orderNumber,
                        imp_uid);
            
            Map<String, Object> response = new HashMap<>();
            response.put("orderNumber", orderNumber);
            response.put("iamportResponse", iamportResponse);
            response.put("orderItems", orderItems);

            return response;
        } else {
            logger.error("Order - Message: {}, ImpUid: {}", 
                        "주문 가격과 결제된 금액이 일치하지 않습니다.",
                        memberId,
                        id,
                        imp_uid);
            cancelPayment(imp_uid);
            throw new IllegalArgumentException("주문 가격과 결제된 금액이 일치하지 않습니다.");
        }
    }

    @Transactional
    @Override
    public IamportResponse<Payment> cancelPayment(String imp_uid) {
        try {
            CancelData cancelData = new CancelData(imp_uid, true);
            IamportResponse<Payment> cancelResponse = iamportClient.cancelPaymentByImpUid(cancelData);

            String status = cancelResponse.getResponse().getStatus();
            if (status.equals("cancelled")) {
                PaymentDetailsEntity paymentDetailsEntity = paymentDetailsRepository.findByImpUid(imp_uid); 

                if (paymentDetailsEntity == null) {
                    logger.error("Cancel - Message: {}, MemberId: {}, Id: {}, ImpUid: {}",
                            "결제 정보를 찾을 수 없습니다.",
                            null,
                            null,
                            imp_uid);

                    throw new IllegalArgumentException("Payment with imp_uid " + imp_uid + " not found");
                }

                paymentDetailsEntity.setStatus(status);
                PaymentDetailsEntity updatedPaymentDetailsEntity = paymentDetailsRepository.save(paymentDetailsEntity);
                MemberDTO memberDTO = memberService.getMemberInfo(updatedPaymentDetailsEntity.getMemberId());

                logger.info("Cancel - Message: {}, MemberId: {}, Id: {}, OrderNumber: {}, ImpUid: {}",
                        "취소 성공",
                        updatedPaymentDetailsEntity.getMemberId(),
                        memberDTO.getId(),
                        updatedPaymentDetailsEntity.getOrderNumber(),
                        updatedPaymentDetailsEntity.getImpUid());

                return cancelResponse;
            } else {
                logger.error("Cancel - Message: {}, MemberId: {}, Id: {}, ImpUid: {}",
                            "취소가 이루어지지 않았습니다.",
                            null,
                            null,
                            imp_uid);
                throw new IllegalAccessError(cancelResponse.getResponse().getFailReason());
            }
        } catch (IamportResponseException | IOException e) {
            logger.error("Cancel - Message: {}, MemberId: {}, Id: {}, ImpUid: {}",
                            "환불 처리 중 오류 발생",
                            null,
                            null,
                            imp_uid);
            throw new IllegalAccessError();
        }
    }

    @Transactional
    @Override
    public ResponseEntity<?> refundIamport(Long memberId, String orderNumber) {
        PaymentDetailsEntity paymentDetail = paymentDetailsRepository.findByMemberIdAndOrderNumber(memberId, orderNumber);
        MemberDTO memberDTO = memberService.getMemberInfo(memberId);
        try {

            if (paymentDetail.getIsCancel() == false) {
                logger.error("Cancel - Message: {}, MemberId: {}, Id: {}, ImpUid: {}",
                        "취소가 불가능합니다.",
                        memberId,
                        memberDTO.getId(),
                        paymentDetail.getImpUid());
                
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("취소가 불가능합니다.");
            }
            IamportResponse<Payment> cancelResponse = cancelPayment(paymentDetail.getImpUid());
            PaymentDetailDTO paymentDetailDTO = mapToPaymentDetailDTO(cancelResponse);

            productService.addProductQuantities(orderNumber, paymentDetailDTO.getOrderItems());
            // 사용된 포인트를 돌려주기
            BigDecimal pointsUsed = paymentDetailDTO.getPoints();

            if (pointsUsed != BigDecimal.ZERO) {
                BigDecimal subTotal = memberService.deductPoints(memberId, pointsUsed.negate()); 
                pointsTransactionService.createTransaction(memberId, "결제취소", pointsUsed, subTotal);
            }

            couponService.returnCoupon(memberId, paymentDetailDTO.getCoupon());

            return ResponseEntity.ok(cancelResponse);
        } catch (Exception e) {
            logger.error("Cancel - Message: {}, MemberId: {}, Id: {}, ImpUid: {}",
                "환불 처리 중 오류 발생.",
                memberId,
                memberDTO.getId(),
                paymentDetail.getImpUid());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("환불 처리 중 오류 발생");
        }
    }

    @Override
    public ResponseEntity<?> getPaymentAndOrderInfo(String orderNumber) {
        try {
            PaymentDetailsEntity paymentDetail = paymentDetailsRepository.findByOrderNumber(orderNumber);
            IamportResponse<Payment> iamportResponse = iamportClient.paymentByImpUid(paymentDetail.getImpUid());

            log.info(iamportResponse.getResponse().getImpUid());

            PaymentAndOrderInfo paymentAndOrderInfo = new PaymentAndOrderInfo();
            paymentAndOrderInfo.setOrderNumber(orderNumber);
            paymentAndOrderInfo.setOrderAt(iamportResponse.getResponse().getStartedAt());
            paymentAndOrderInfo.setProductName(iamportResponse.getResponse().getName());
            paymentAndOrderInfo.setName(iamportResponse.getResponse().getBuyerName());
            paymentAndOrderInfo.setPostCode(iamportResponse.getResponse().getBuyerPostcode());
            paymentAndOrderInfo.setAddress(iamportResponse.getResponse().getBuyerAddr());
            paymentAndOrderInfo.setPhone(iamportResponse.getResponse().getBuyerTel());

            paymentAndOrderInfo.setPaymentAt(iamportResponse.getResponse().getPaidAt());
            paymentAndOrderInfo.setPaymentStatus(iamportResponse.getResponse().getStatus());
            paymentAndOrderInfo.setPgProvider(iamportResponse.getResponse().getPgProvider());
            paymentAndOrderInfo.setPaymentMethod(iamportResponse.getResponse().getPayMethod());
            paymentAndOrderInfo.setAmount(iamportResponse.getResponse().getAmount());

            // 결제 종류에 따라 추가 정보 설정
            switch (iamportResponse.getResponse().getPayMethod()) {
                case "card":
                    paymentAndOrderInfo.setPaymentMethod("신용/체크카드");
                    paymentAndOrderInfo.setCardName(iamportResponse.getResponse().getCardName());
                    paymentAndOrderInfo.setInstallmentMonths(iamportResponse.getResponse().getCardQuota());
                    paymentAndOrderInfo.setCardNumber(iamportResponse.getResponse().getCardNumber());
                    paymentAndOrderInfo.setVbanIssuedAt(iamportResponse.getResponse().getVbankIssuedAt());
                    break;
                case "vbank":
                    // 무통장입금인 경우 추가 정보 설정
                    paymentAndOrderInfo.setPaymentMethod("무통장 입금");
                    paymentAndOrderInfo.setVbankName(iamportResponse.getResponse().getVbankName());
                    paymentAndOrderInfo.setVbankNum(iamportResponse.getResponse().getVbankNum());
                    paymentAndOrderInfo.setVbankHolder(iamportResponse.getResponse().getVbankHolder());

                    break;
                case "trans":
                    // 계좌이체인 경우 추가 정보 설정
                    paymentAndOrderInfo.setPaymentMethod("계좌이체");
                    paymentAndOrderInfo.setBankName(iamportResponse.getResponse().getBankName());
                    break;
                case "point":
                    // 계좌이체인 경우 추가 정보 설정
                    paymentAndOrderInfo.setPaymentMethod("간편결제");

                    break;
                default:
                    break;
            }

            // 결제 상태에 따라 수정
            if (iamportResponse.getResponse().getStatus().equals("cancelled")) {
                paymentAndOrderInfo.setPaymentStatus("결제 취소");
            } else if (iamportResponse.getResponse().getStatus().equals("paid")) {
                paymentAndOrderInfo.setPaymentStatus("결제 완료");
            } else if (iamportResponse.getResponse().getStatus().equals("ready")) {
                paymentAndOrderInfo.setPaymentStatus("결제 예정");
            } else if (iamportResponse.getResponse().getStatus().equals("failed")) {
                paymentAndOrderInfo.setPaymentStatus("결제 실패");
            }

            // PG사가 카카오페이인 경우
            if (iamportResponse.getResponse().getPgProvider().equalsIgnoreCase("kakaopay")) {
                paymentAndOrderInfo.setPaymentMethod("카카오페이");
            }

            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> jsonMap = objectMapper.readValue(iamportResponse.getResponse().getCustomData(),
                    new TypeReference<Map<String, Object>>() {
                    });

            CouponDTO coupon = objectMapper.convertValue(jsonMap.get("coupon"),
                    new TypeReference<CouponDTO>() {
                    });
            BigDecimal points = objectMapper.convertValue(jsonMap.get("points"),
                    new TypeReference<BigDecimal>() {
                    });

            paymentAndOrderInfo.setCoupon(coupon);
            paymentAndOrderInfo.setPoints(points);

            return ResponseEntity.ok(paymentAndOrderInfo);
        } catch (Exception e) {
            throw new IllegalAccessError("결제 정보 확인 중 오류 발생");
        }
    }

    public PaymentDetailDTO mapToPaymentDetailDTO(IamportResponse<Payment> iamportResponse)
            throws JsonMappingException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap = objectMapper.readValue(iamportResponse.getResponse().getCustomData(),
                new TypeReference<Map<String, Object>>() {
                });

        PaymentDetailDTO paymentDetailDTO = new PaymentDetailDTO();
        List<PaymentItemDTO> orderItems = objectMapper.convertValue(jsonMap.get("orderItems"),
                new TypeReference<List<PaymentItemDTO>>() {
                });
        CouponDTO coupon = objectMapper.convertValue(jsonMap.get("coupon"),
                new TypeReference<CouponDTO>() {
                });
        BigDecimal points = objectMapper.convertValue(jsonMap.get("points"),
                new TypeReference<BigDecimal>() {
                });

        paymentDetailDTO.setOrderItems(orderItems);
        paymentDetailDTO.setCoupon(coupon);
        paymentDetailDTO.setPoints(points);

        return paymentDetailDTO;

    }

}
