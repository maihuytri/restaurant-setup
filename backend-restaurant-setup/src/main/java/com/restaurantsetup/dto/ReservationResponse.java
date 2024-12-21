package com.restaurantsetup.dto;

import java.time.LocalDateTime;

public record ReservationResponse(
                Long reservationId,
                String note,
                String title,
                LocalDateTime date,
                String time,
                String status,
                BookingTableResponse bookingTableResponse,
                UserResponse userResponse) {

}
