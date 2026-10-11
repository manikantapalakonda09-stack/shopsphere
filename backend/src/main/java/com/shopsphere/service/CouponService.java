package com.shopsphere.service;

import com.shopsphere.dto.CouponDto;
import com.shopsphere.dto.CouponValidateRequest;
import com.shopsphere.entity.Coupon;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CouponService {

    @Autowired
    private CouponRepository couponRepository;

    @Transactional(readOnly = true)
    public List<CouponDto> getAllCoupons() {
        return couponRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CouponDto validateCoupon(CouponValidateRequest request) {
        Coupon coupon = couponRepository.findByCodeIgnoreCase(request.getCode())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid coupon code: " + request.getCode()));

        if (!coupon.isValid(request.getOrderAmount())) {
            throw new BadRequestException("Coupon is expired, inactive, or order amount does not meet the minimum requirement of ₹" + coupon.getMinOrderValue());
        }

        BigDecimal discount = coupon.calculateDiscount(request.getOrderAmount());
        CouponDto dto = mapToDto(coupon);
        dto.setCalculatedDiscount(discount);
        return dto;
    }

    @Transactional
    public CouponDto createCoupon(CouponDto dto) {
        if (couponRepository.findByCodeIgnoreCase(dto.getCode()).isPresent()) {
            throw new BadRequestException("Coupon code already exists: " + dto.getCode());
        }

        Coupon coupon = new Coupon();
        coupon.setCode(dto.getCode().toUpperCase().trim());
        coupon.setDiscountType(com.shopsphere.entity.DiscountType.valueOf(dto.getDiscountType()));
        coupon.setDiscountValue(dto.getDiscountValue());
        coupon.setMinOrderValue(dto.getMinOrderValue() != null ? dto.getMinOrderValue() : BigDecimal.ZERO);
        coupon.setMaxDiscount(dto.getMaxDiscount());
        coupon.setStartDate(dto.getStartDate());
        coupon.setExpiryDate(dto.getExpiryDate());
        coupon.setUsageLimit(dto.getUsageLimit() != null ? dto.getUsageLimit() : 1000);
        coupon.setActive(dto.getActive() != null ? dto.getActive() : true);

        Coupon saved = couponRepository.save(coupon);
        return mapToDto(saved);
    }

    @Transactional
    public void toggleCouponStatus(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));
        coupon.setActive(!Boolean.TRUE.equals(coupon.getActive()));
        couponRepository.save(coupon);
    }

    public CouponDto mapToDto(Coupon coupon) {
        CouponDto dto = new CouponDto();
        dto.setId(coupon.getId());
        dto.setCode(coupon.getCode());
        dto.setDiscountType(coupon.getDiscountType().name());
        dto.setDiscountValue(coupon.getDiscountValue());
        dto.setMinOrderValue(coupon.getMinOrderValue());
        dto.setMaxDiscount(coupon.getMaxDiscount());
        dto.setStartDate(coupon.getStartDate());
        dto.setExpiryDate(coupon.getExpiryDate());
        dto.setUsageLimit(coupon.getUsageLimit());
        dto.setTimesUsed(coupon.getTimesUsed());
        dto.setActive(coupon.getActive());
        return dto;
    }
}
