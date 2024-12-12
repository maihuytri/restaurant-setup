package com.restaurantsetup.dto;

import jakarta.validation.constraints.NotBlank;


public record MenuItemRequestDTO(

        @NotBlank(message = "Name cannot be blank")
        String name,

        String description,

        double price,

        @NotBlank(message = "Category cannot be blank")
        String category
) {
}
