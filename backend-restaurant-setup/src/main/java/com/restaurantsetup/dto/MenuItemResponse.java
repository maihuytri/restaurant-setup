package com.restaurantsetup.dto;

public record MenuItemResponse(
                Long id,
                String name,
                String description,
                Double price,
                String category,
                Integer stock) {
}
