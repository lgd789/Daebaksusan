package com.seafood.back.controller;

import org.springframework.web.bind.annotation.RestController;

import com.seafood.back.dto.GuestInfo;
import com.seafood.back.dto.PaymentDetailDTO;
import com.seafood.back.service.InfoService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Slf4j
@RestController
@RequestMapping("/api/v1/guest")
@RequiredArgsConstructor
public class GuestController {

    private final InfoService infoService;

    @PostMapping("/orderDetail")
    public ResponseEntity<?> getOrder(@RequestBody GuestInfo info) {

        try {

            String orderNumber = info.getOrderNumber();
            String password = info.getPassword();

            log.info(orderNumber);
            log.info(password);

            List<PaymentDetailDTO> paymentDTO = infoService.getPaymentByOrderNumberAndPassword(orderNumber, password);

            return ResponseEntity.ok(paymentDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("실패");
        }
    }

}
