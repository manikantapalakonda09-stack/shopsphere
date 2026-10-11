package com.shopsphere.service;

import com.shopsphere.dto.SettlementDto;
import com.shopsphere.entity.Settlement;
import com.shopsphere.entity.SettlementStatus;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.SettlementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SettlementService {

    @Autowired
    private SettlementRepository settlementRepository;

    @Transactional(readOnly = true)
    public List<SettlementDto> getSellerSettlements(Long sellerId) {
        return settlementRepository.findBySellerIdOrderByCreatedAtDesc(sellerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SettlementDto> getAllSettlements() {
        return settlementRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public SettlementDto releaseSettlement(Long settlementId) {
        Settlement settlement = settlementRepository.findById(settlementId)
                .orElseThrow(() -> new ResourceNotFoundException("Settlement not found with id: " + settlementId));

        settlement.setStatus(SettlementStatus.COMPLETED);
        settlement.setReleasedAt(LocalDateTime.now());
        Settlement saved = settlementRepository.save(settlement);
        return mapToDto(saved);
    }

    public SettlementDto mapToDto(Settlement settlement) {
        SettlementDto dto = new SettlementDto();
        dto.setId(settlement.getId());
        dto.setSellerOrderId(settlement.getSellerOrder().getId());
        dto.setSellerOrderNumber(settlement.getSellerOrder().getSellerOrderNumber());
        dto.setSellerId(settlement.getSeller().getId());
        dto.setStoreName(settlement.getSeller().getStoreName());
        dto.setGrossAmount(settlement.getGrossAmount());
        dto.setPlatformCommission(settlement.getPlatformCommission());
        dto.setNetPayable(settlement.getNetPayable());
        dto.setStatus(settlement.getStatus().name());
        dto.setTransactionReference(settlement.getTransactionReference());
        dto.setReleasedAt(settlement.getReleasedAt());
        dto.setCreatedAt(settlement.getCreatedAt());
        return dto;
    }
}
