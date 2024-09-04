package com.seafood.back.service;

import java.math.BigDecimal;

import org.springframework.data.domain.Page;

import com.seafood.back.entity.PointsDetailsEntity;

public interface PointsTransactionService {
    public Page<PointsDetailsEntity> getAllTransactions(Long memberId, int page, int size);
    public PointsDetailsEntity createTransaction(Long memberId, String description, BigDecimal usageAmount, BigDecimal subTotal);
    
}
