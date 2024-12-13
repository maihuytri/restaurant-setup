package com.restaurantsetup.dto;


import jakarta.validation.constraints.Positive;

public record OrderRequest(
        String customerName,
        String contactTel,
        @Positive(message = "quantity must be positive")
        Integer menuItemCount,
        MenuItemRequest menuItemRequest,
        String note
) {
}
