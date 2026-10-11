package com.shopsphere.repository;

import com.shopsphere.entity.BrowsingHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BrowsingHistoryRepository extends JpaRepository<BrowsingHistory, Long> {
    List<BrowsingHistory> findTop20ByCustomerIdOrderByViewedAtDesc(Long customerId);
}
