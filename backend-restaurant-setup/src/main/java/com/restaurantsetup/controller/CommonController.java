package com.restaurantsetup.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurantsetup.dto.BookingTableResponse;
import com.restaurantsetup.service.BookingTableService;
import com.restaurantsetup.service.ReservationService;

@RestController
public class CommonController {
    @Autowired
    private BookingTableService bookingTableService;
    @Autowired
    private ReservationService reservationService;

    @GetMapping("/tables/list")
    public ResponseEntity<?> getAllBookingTables() {
        List<BookingTableResponse> bookingTableResponse = bookingTableService.getAllBookingTables();
        return new ResponseEntity<List<BookingTableResponse>>(bookingTableResponse,
                HttpStatus.OK);
    }

    @GetMapping("/tables/getById/{id}")
    public ResponseEntity<?> getBookingTableById(@PathVariable Long id) {
        BookingTableResponse bookingTableResponse = bookingTableService.getBookingTableById(id);
        return new ResponseEntity<BookingTableResponse>(bookingTableResponse,
                HttpStatus.OK);
    }

    @GetMapping("/tables/{name}")
    public ResponseEntity<?> getBookingTableByName(@PathVariable String name) {
        BookingTableResponse bookingTableResponse = bookingTableService.getBookingTableByName(name);
        return new ResponseEntity<BookingTableResponse>(bookingTableResponse,
                HttpStatus.OK);
    }

    @PostMapping("/reservations/cancel-reservation/{id}")
    public ResponseEntity<?> cancelReservation(@PathVariable Long id) {
        reservationService.cancelReservation(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
