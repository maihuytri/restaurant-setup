package com.restaurantsetup.dto;

public record ReservationResponse(
        Long reservationId,
        String note,
        String title) {

}
