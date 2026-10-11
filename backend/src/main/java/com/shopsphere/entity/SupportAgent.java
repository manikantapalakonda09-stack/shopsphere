package com.shopsphere.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "support_agents")
public class SupportAgent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 100)
    private String department = "Customer Resolution";

    @Column(name = "active_tickets_count")
    private Integer activeTicketsCount = 0;

    public SupportAgent() {}

    public SupportAgent(User user) {
        this.user = user;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getActiveTicketsCount() { return activeTicketsCount; }
    public void setActiveTicketsCount(Integer activeTicketsCount) { this.activeTicketsCount = activeTicketsCount; }
}
