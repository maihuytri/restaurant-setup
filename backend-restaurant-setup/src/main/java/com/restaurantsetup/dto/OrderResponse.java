package com.restaurantsetup.dto;

import com.restaurantsetup.Util.OrderStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(Long id, @NotBlank(message = "customer name cannot be blank") String customerName,
                @Pattern(regexp = "^[+]?\\d{10,15}$", message = "Contact telephone must be valid and contain 10-15 digits") String contactTel,
                LocalDateTime orderDate,
                String note,
                OrderStatus status,
                MenuItemResponse menuItem,
                double totalPrice,
                int quantity

) {
}
