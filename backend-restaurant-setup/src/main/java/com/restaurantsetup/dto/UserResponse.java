package com.restaurantsetup.dto;

public record UserResponse(
                Long id,
                String username,
                String customerName,
                String contactTel,
                String role) {

}
