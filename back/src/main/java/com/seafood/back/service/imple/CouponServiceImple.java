package com.seafood.back.service.imple;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.seafood.back.dto.CouponAmountResult;
import com.seafood.back.dto.CouponDTO;
import com.seafood.back.entity.CouponEntity;
import com.seafood.back.entity.MemberCouponEntity;
import com.seafood.back.entity.MemberEntity;
import com.seafood.back.respository.CouponRepository;
import com.seafood.back.respository.MemberCouponRepository;
import com.seafood.back.respository.MemberRepository;
import com.seafood.back.service.CouponService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CouponServiceImple implements CouponService {

    private static final Logger logger = LoggerFactory.getLogger(CouponServiceImple.class);

    private final MemberCouponRepository memberCouponRepository;
    private final CouponRepository couponRepository;
    private final MemberRepository memberRepository;

    @Override
    public CouponAmountResult couponAmount(Long memberId, CouponDTO coupon) {
        if (memberId == null || coupon == null) {
            return new CouponAmountResult(BigDecimal.ZERO, BigDecimal.ZERO);
        }

        List<MemberCouponEntity> coupons = memberCouponRepository.findCouponsByMember_memberId(memberId);

        CouponEntity sameCoupon = coupons.stream()
                .filter(c -> c.getCoupon().getCouponId().equals(coupon.getCouponId())
                        && c.getCoupon().getDiscount().equals(coupon.getDiscount()))
                .findFirst()
                .map(MemberCouponEntity::getCoupon)
                .orElse(null);

        if (sameCoupon == null) {
            return new CouponAmountResult(BigDecimal.ZERO, BigDecimal.ZERO);
        }

        BigDecimal couponAmount = sameCoupon.getDiscount();
        BigDecimal minimumOrderAmount = sameCoupon.getMinimumOrderAmount();

        return new CouponAmountResult(couponAmount, minimumOrderAmount);
    }

    @Transactional
    @Override
    public List<CouponDTO> mapCouponsToDTOs(Long memberId) {
        // 현재 시간
        Date now = new Date();

        // 회원이 가진 쿠폰 정보를 가져옴
        List<MemberCouponEntity> coupons = memberCouponRepository.findCouponsByMember_memberId(memberId);

        // 가져온 쿠폰 정보를 DTO에 매핑하여 반환
        List<CouponDTO> validCoupons = coupons.stream()
                .filter(coupon -> coupon.getValidUntil().after(now)) // 만료되지 않은 쿠폰만 필터링
                .map(coupon -> {
                    CouponDTO dto = new CouponDTO();
                    dto.setId(coupon.getId());
                    dto.setCouponId(coupon.getCoupon().getCouponId());
                    dto.setCouponName(coupon.getCoupon().getCouponName());
                    dto.setDiscount(coupon.getCoupon().getDiscount());
                    dto.setMinimumOrderAmount(coupon.getCoupon().getMinimumOrderAmount());
                    dto.setIssueDate(coupon.getIssueDate());
                    dto.setValidUntil(coupon.getValidUntil());
                    return dto;
                })
                .collect(Collectors.toList());

        List<MemberCouponEntity> expiredCoupons = coupons.stream()
                .filter(coupon -> coupon.getValidUntil().before(now))
                .collect(Collectors.toList());

        if (!expiredCoupons.isEmpty()) {
            List<Long> expiredCouponIds = expiredCoupons.stream()
                    .map(MemberCouponEntity::getId)
                    .collect(Collectors.toList());

            memberCouponRepository.deleteByIdInAndMember_memberId(expiredCouponIds, memberId);

            expiredCoupons.forEach(coupon -> {
                logger.info("Coupon - Message: {}, MemberId: {}, Id: {}, CouponId: {}, CouponName: {}, Amount: {}",
                        "만료 쿠폰 삭제",
                        coupon.getMember().getMemberId(),
                        coupon.getMember().getId(),
                        coupon.getCoupon().getCouponId(),
                        coupon.getCoupon().getCouponName(),
                        null);
            });
        }

        return validCoupons;
    }

    @Transactional
    @Override
    public void removeCoupon(Long memberId, Long id) {
        MemberCouponEntity memberCouponEntity = memberCouponRepository.findByIdAndMember_memberId(id, memberId);
        try {
            if (memberCouponEntity != null) {
                // 쿠폰 엔티티가 존재하면 삭제
                memberCouponRepository.delete(memberCouponEntity);

                logger.info("Coupon - Message: {}, MemberId: {}, Id: {}, CouponId: {}, CouponName: {}, Amount: {}",
                        "쿠폰 사용",
                        memberCouponEntity.getMember().getMemberId(),
                        memberCouponEntity.getMember().getId(),
                        memberCouponEntity.getCoupon().getCouponId(),
                        memberCouponEntity.getCoupon().getCouponName(),
                        memberCouponEntity.getCoupon().getDiscount());
            } else {
                logger.error("Coupon - Message: {}, MemberId: {}, Id: {}, CouponId: {}, CouponName: {}",
                        "쿠폰을 찾지 못하였습니다.",
                        memberId,
                        null,
                        id,
                        null);
            }
        } catch (Exception e) {
            logger.error("Coupon - Message: {}, MemberId: {}, Id: {}, CouponId: {}, CouponName: {}",
                    "쿠폰 삭제 중 오류 발생",
                    memberId,
                    memberCouponEntity != null ? memberCouponEntity.getMember().getId() : null,
                    id,
                    memberCouponEntity != null ? memberCouponEntity.getCoupon().getCouponName() : null);
            throw e;
        }
    }

    @Transactional
    @Override
    public void returnCoupon(Long memberId, CouponDTO coupon) {
        if (coupon == null) {
            return;
        }

        try {
                MemberEntity member = memberRepository.findByMemberId(memberId);
                CouponEntity couponEntity = couponRepository.findByCouponId(coupon.getCouponId());

                if (member == null) {
                    logger.error("Coupon - Message: {}, MemberId: {}, Id: {}, CouponId: {}, CouponName: {}",
                            "쿠폰 반환 실패 - 해당 memberId로 회원을 찾을 수 없음",
                            memberId,
                            null,
                            coupon.getCouponId(),
                            coupon.getCouponName());
                }
                
          
                MemberCouponEntity memberCoupon = new MemberCouponEntity();

                memberCoupon.setMember(member);
                memberCoupon.setCoupon(couponEntity);
                memberCoupon.setIssueDate(coupon.getIssueDate());
                memberCoupon.setValidUntil(coupon.getValidUntil());

                MemberCouponEntity memberCouponEntity = memberCouponRepository.save(memberCoupon);

                if (memberCouponEntity != null && memberCouponEntity.getMember() != null) {
                    logger.info("Coupon - Message: {}, MemberId: {}, Id: {}, CouponId: {}, CouponName: {}, Amount: {}",
                            "쿠폰 반환",
                            memberCouponEntity.getMember().getMemberId(),
                            memberCouponEntity.getMember().getId(),
                            memberCouponEntity.getCoupon().getCouponId(),
                            memberCouponEntity.getCoupon().getCouponName(),
                            memberCouponEntity.getCoupon().getDiscount());
                } else {
                    logger.error("Coupon - Message: {}, MemberId: {}, Id: {}, CouponId: {}, CouponName: {}",
                            "쿠폰 반환 실패 - 연관된 회원이 없음",
                            memberId,
                            null,
                            coupon.getCouponId(),
                            coupon.getCouponName());
                }

        } catch (Exception e) {
            logger.error("Coupon - Message: {}, MemberId: {}, Id: {}, CouponId: {}, CouponName: {}",
                    "쿠폰 반환 중 오류 발생",
                    memberId,
                    null,
                    coupon != null ? coupon.getCouponId() : null,
                    coupon != null ? coupon.getCouponName() : null);
        }
    }

    @Transactional
    @Override
    public void createMemberCoupon(Long memberId, Long couponId) {
        // 쿠폰 ID로 해당 쿠폰을 조회합니다.
        CouponEntity coupon = couponRepository.findByCouponId(couponId);

        if (coupon == null) {
            logger.error("Coupon - Message: {}, MemberId: {}, Id: {}, CouponId: {}, CouponName: {}",
                    "해당 쿠폰을 찾을 수 없습니다.",
                    memberId,
                    null,
                    couponId,
                    null);
            throw new IllegalArgumentException("해당 쿠폰을 찾을 수 없습니다.");
        }

        MemberEntity member = memberRepository.findByMemberId(memberId);
        MemberCouponEntity memberCoupon = new MemberCouponEntity();

        memberCoupon.setMember(member);
        memberCoupon.setCoupon(coupon);;
        memberCoupon.setIssueDate(new Date());

        if (coupon.getExpirationPeriod() != null) {
            LocalDate currentDate = LocalDate.now();
            LocalDate expirationDate = currentDate.plusMonths(coupon.getExpirationPeriod());
            memberCoupon.setValidUntil(Date.from(expirationDate.atStartOfDay(ZoneId.systemDefault()).toInstant()));
        } else {
            // 만료 기간이 지정되지 않은 경우 쿠폰의 유효 기간으로 설정
            memberCoupon.setValidUntil(coupon.getValidUntil());
        }

        // 회원 쿠폰 저장
        MemberCouponEntity memberCouponEntity = memberCouponRepository.save(memberCoupon);

        logger.info("Coupon - Message: {}, MemberId: {}, Id: {}, CouponId: {}, CouponName: {}, Amount: {}",
                "쿠폰 추가",
                memberCouponEntity.getMember().getMemberId(),
                memberCouponEntity.getMember().getId(),
                memberCouponEntity.getCoupon().getCouponId(),
                memberCouponEntity.getCoupon().getCouponName(),
                null);
    }

}
