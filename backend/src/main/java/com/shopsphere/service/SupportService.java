package com.shopsphere.service;

import com.shopsphere.dto.DisputeCreateRequest;
import com.shopsphere.dto.TicketCreateRequest;
import com.shopsphere.entity.*;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class SupportService {

    @Autowired
    private SupportTicketRepository ticketRepository;

    @Autowired
    private DisputeRepository disputeRepository;

    @Autowired
    private ReturnRepository returnRepository;

    @Autowired
    private RefundRepository refundRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private SellerOrderRepository sellerOrderRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private SupportAgentRepository supportAgentRepository;

    @Transactional
    public SupportTicket createTicket(Long customerId, TicketCreateRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Order order = null;
        if (request.getOrderId() != null) {
            order = orderRepository.findById(request.getOrderId()).orElse(null);
        }

        TicketPriority priority = TicketPriority.valueOf(request.getPriority() != null ? request.getPriority() : "MEDIUM");
        SupportTicket ticket = new SupportTicket(customer, order, request.getSubject(), request.getDescription(), priority);

        // Auto-assign to available agent if any
        List<SupportAgent> agents = supportAgentRepository.findAll();
        if (!agents.isEmpty()) {
            SupportAgent agent = agents.get(0);
            ticket.setAssignedAgent(agent);
            agent.setActiveTicketsCount(agent.getActiveTicketsCount() + 1);
            supportAgentRepository.save(agent);
        }

        return ticketRepository.save(ticket);
    }

    @Transactional(readOnly = true)
    public List<SupportTicket> getCustomerTickets(Long customerId) {
        return ticketRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    @Transactional(readOnly = true)
    public List<SupportTicket> getAllTickets() {
        return ticketRepository.findAll();
    }

    @Transactional
    public SupportTicket updateTicketStatus(Long ticketId, String status) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        ticket.setStatus(TicketStatus.valueOf(status));
        return ticketRepository.save(ticket);
    }

    @Transactional
    public Dispute createDispute(Long customerId, DisputeCreateRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + request.getOrderId()));

        Seller seller = sellerRepository.findById(request.getSellerId())
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found with id: " + request.getSellerId()));

        Dispute dispute = new Dispute(order, customer, seller, request.getIssueType(), request.getDetails());
        return disputeRepository.save(dispute);
    }

    @Transactional(readOnly = true)
    public List<Dispute> getAllDisputes() {
        return disputeRepository.findAll();
    }

    @Transactional
    public Dispute resolveDispute(Long disputeId, String decision, String status) {
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new ResourceNotFoundException("Dispute not found with id: " + disputeId));

        dispute.setAdminDecision(decision);
        dispute.setStatus(DisputeStatus.valueOf(status));
        return disputeRepository.save(dispute);
    }

    @Transactional
    public Return requestReturn(Long customerId, Long orderId, Long sellerOrderId, String reason) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        SellerOrder sellerOrder = sellerOrderRepository.findById(sellerOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller order not found"));

        Return ret = new Return(order, sellerOrder, customer, reason);
        sellerOrder.setStatus(OrderStatus.RETURN_REQUESTED);
        sellerOrderRepository.save(sellerOrder);

        return returnRepository.save(ret);
    }

    @Transactional(readOnly = true)
    public List<Return> getAllReturns() {
        return returnRepository.findAll();
    }

    @Transactional
    public Refund approveReturnAndRefund(Long returnId) {
        Return ret = returnRepository.findById(returnId)
                .orElseThrow(() -> new ResourceNotFoundException("Return request not found with id: " + returnId));

        ret.setStatus("APPROVED");
        returnRepository.save(ret);

        SellerOrder so = ret.getSellerOrder();
        so.setStatus(OrderStatus.RETURN_APPROVED);
        sellerOrderRepository.save(so);

        BigDecimal refundAmount = so.getSellerPayableAmount().add(so.getPlatformCommission());

        Refund refund = new Refund(ret, ret.getOrder(), refundAmount, "Approved return refund for seller order #" + so.getSellerOrderNumber());
        refund.setStatus("PROCESSED");
        refund.setProcessedAt(LocalDateTime.now());
        refund.setTransactionId("REF-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase());

        return refundRepository.save(refund);
    }
}
