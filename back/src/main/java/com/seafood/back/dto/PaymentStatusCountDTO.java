package com.seafood.back.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class PaymentStatusCountDTO {
    private Long paidCount;
    private Long readyCount;
    private Long failedCount;
    private Long cancelledCount;

    public PaymentStatusCountDTO(Long paidCount, Long readyCount, Long failedCount, Long cancelledCount) {
        this.paidCount = paidCount != null ? paidCount : 0;
        this.readyCount = readyCount != null ? readyCount : 0;
        this.failedCount = failedCount != null ? failedCount : 0;
        this.cancelledCount = cancelledCount != null ? cancelledCount : 0;
    }
}
