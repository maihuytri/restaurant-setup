package com.restaurantsetup.dto;

public record ReservationRequest(
        String note,
        String title,
        String time,
        String status) {

}
