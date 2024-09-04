package com.seafood.back.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seafood.back.service.PaymentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService; 
    

    @PostMapping("/verifyIamport/{imp_uid}")
    public ResponseEntity<?> paymentByImpUid(@PathVariable String imp_uid) {
        try {
            
            Map<String, Object> response = paymentService.verifyAndProcessPayment(imp_uid);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("오류 발생: " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e);
        }
    }

    @PostMapping("/refundIamport/{orderNumber}")
    public ResponseEntity<?> cancelPayment(Authentication authentication, @PathVariable String orderNumber) {
        try {
            Long memberId = Long.parseLong(authentication.getName());

            ResponseEntity<?> response = paymentService.refundIamport(memberId, orderNumber);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("결제 취소 중 오류가 발생했습니다.");
        }
    }

    @PostMapping("/getPaymentAndOrderInfo/{orderNumber}")
    public ResponseEntity<?> getPaymentAndOrderInfo(@PathVariable String orderNumber) {
        try {
            ResponseEntity<?> response  = paymentService.getPaymentAndOrderInfo(orderNumber);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e);
        }
    }

}