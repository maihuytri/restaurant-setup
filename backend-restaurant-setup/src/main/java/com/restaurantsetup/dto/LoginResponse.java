package com.restaurantsetup.dto;

public class LoginResponse {
    private String token;
    private String name;
    private String role;

    // Constructor
    public LoginResponse(String token, String name, String role) {
        this.token = token;
        this.name = name;
        this.role = role;
    }

    // Getters
    public String getToken() {
        return token;
    }

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }
}
