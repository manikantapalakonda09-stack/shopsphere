package com.shopsphere.repository;

import com.shopsphere.entity.SupportTicket;
import com.shopsphere.entity.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<SupportTicket> findByStatus(TicketStatus status);
    List<SupportTicket> findByAssignedAgentId(Long agentId);
}
