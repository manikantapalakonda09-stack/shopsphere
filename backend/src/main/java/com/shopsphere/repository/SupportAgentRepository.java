package com.shopsphere.repository;

import com.shopsphere.entity.SupportAgent;
import com.shopsphere.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SupportAgentRepository extends JpaRepository<SupportAgent, Long> {
    Optional<SupportAgent> findByUser(User user);
    Optional<SupportAgent> findByUserId(Long userId);
}
