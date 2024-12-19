package com.restaurantsetup.dto;

public class LoginResponse {
    private String token;
    private String name;
    private String role;
    private String customername;

    // Constructor
    public LoginResponse(String token, String name, String role, String customername) {
        this.token = token;
        this.name = name;
        this.role = role;
        this.customername = customername;
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

    public String getCustomername() {
        return customername;
    }

}
