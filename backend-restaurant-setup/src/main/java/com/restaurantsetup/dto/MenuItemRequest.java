package com.restaurantsetup.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;


public record MenuItemRequest(
        @NotBlank(message = "Name cannot be blank")
        String name,
        String description,
        @NotNull(message = "Price cannot be null")
        @Positive(message = "Price must be positive")
        Double price,
        @NotBlank(message = "Category cannot be blank")
        String category
) {
}
