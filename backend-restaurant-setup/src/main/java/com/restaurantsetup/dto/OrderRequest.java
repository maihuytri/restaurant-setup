package com.restaurantsetup.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

public record OrderRequest(
                @NotBlank(message = "customer name cannot be blank") String customerName,
                @Pattern(regexp = "^[+]?\\d{10,15}$", message = "Contact telephone must be valid and contain 10-15 digits") String contactTel,
                @Positive(message = "quantity must be positive") Integer menuItemCount,
                MenuItemRequest menuItemRequest,
                String note,
                String status) {
}
