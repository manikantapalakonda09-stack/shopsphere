package com.shopsphere.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "seller_profiles")
public class SellerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false, unique = true)
    private Seller seller;

    @Column(name = "banner_url", length = 500)
    private String bannerUrl;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "bank_account_name", length = 120)
    private String bankAccountName;

    @Column(name = "bank_account_number", length = 100)
    private String bankAccountNumber;

    @Column(name = "bank_name", length = 120)
    private String bankName;

    @Column(name = "bank_routing_number", length = 50)
    private String bankRoutingNumber;

    public SellerProfile() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Seller getSeller() { return seller; }
    public void setSeller(Seller seller) { this.seller = seller; }

    public String getBannerUrl() { return bannerUrl; }
    public void setBannerUrl(String bannerUrl) { this.bannerUrl = bannerUrl; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getBankAccountName() { return bankAccountName; }
    public void setBankAccountName(String bankAccountName) { this.bankAccountName = bankAccountName; }

    public String getBankAccountNumber() { return bankAccountNumber; }
    public void setBankAccountNumber(String bankAccountNumber) { this.bankAccountNumber = bankAccountNumber; }

    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }

    public String getBankRoutingNumber() { return bankRoutingNumber; }
    public void setBankRoutingNumber(String bankRoutingNumber) { this.bankRoutingNumber = bankRoutingNumber; }
}
