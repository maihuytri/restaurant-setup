package com.restaurantsetup.dto;

import java.time.LocalDate;

public record ReservationResponse(
        Long reservationId,
        String note,
        String title,
        LocalDate date,
        String time,
        BookingTableResponse bookingTableResponse,
        UserResponse userResponse) {

}
