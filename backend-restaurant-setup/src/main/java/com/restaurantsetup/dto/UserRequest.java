package com.restaurantsetup.dto;

public record UserRequest(
                Long id,
                String username,
                String customerName,
                String contactTel,
                String password,
                String role) {

}
