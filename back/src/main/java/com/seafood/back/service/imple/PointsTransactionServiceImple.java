package com.seafood.back.service.imple;

import java.math.BigDecimal;

import java.util.List;
import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.seafood.back.entity.MemberEntity;
import com.seafood.back.entity.PointsDetailsEntity;
import com.seafood.back.respository.MemberRepository;
import com.seafood.back.respository.PointsTransactionRepository;
import com.seafood.back.service.PointsTransactionService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PointsTransactionServiceImple implements PointsTransactionService{

    private final PointsTransactionRepository pointsTransactionRepository;
     private final MemberRepository memberRepository;
    
    @Override
    public Page<PointsDetailsEntity> getAllTransactions(Long memberId, int page, int size) {

        Pageable pageable = PageRequest.of(page - 1, size);

        Page<PointsDetailsEntity> pointsDetailsPage = pointsTransactionRepository.findByMember_memberIdOrderByPtIdDesc(memberId, pageable);
        return pointsDetailsPage;
    }

    @Transactional
    @Override
    public PointsDetailsEntity createTransaction(Long memberId, String description, BigDecimal usageAmount, BigDecimal subTotal) {
        MemberEntity member = memberRepository.findByMemberId(memberId);
        PointsDetailsEntity transactionEntity = new PointsDetailsEntity();

        transactionEntity.setMember(member);
        transactionEntity.setDate(new Date());
        transactionEntity.setDescription(description);
        transactionEntity.setUsageAmount(usageAmount);
        transactionEntity.setSubTotal(subTotal);

        return pointsTransactionRepository.save(transactionEntity); // 적립금 거래 내역 저장 후 반환
    }
    
}
