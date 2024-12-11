package com.restaurantsetup.entity;

import jakarta.persistence.Embeddable;

@Embeddable
public class Contact {
    private String email;
    private String phone;

    // Constructors
    public Contact() {
    }

    public Contact(String email, String phone) {
        this.email = email;
        this.phone = phone;
    }

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}