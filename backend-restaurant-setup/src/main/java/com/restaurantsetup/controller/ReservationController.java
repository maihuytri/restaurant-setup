package com.restaurantsetup.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurantsetup.dto.ReservationRequest;
import com.restaurantsetup.dto.ReservationResponse;
import com.restaurantsetup.service.ReservationService;

@RestController
@RequestMapping("/reservations")
public class ReservationController {
    @Autowired
    private ReservationService reservationService;

    @PostMapping("/create/{bookingTableId}")
    public ReservationResponse createReservation(@RequestBody ReservationRequest reservationRequest,
            @PathVariable Long bookingTableId) {
        ReservationResponse reservationResponse = reservationService.createReservation(reservationRequest,
                bookingTableId);
        return reservationResponse;
    }

    @GetMapping("/{id}")
    public ReservationResponse getReservationById(@PathVariable Long id) {
        ReservationResponse reservationResponse = reservationService.getReservationById(id);

        return reservationResponse;
    }

    @GetMapping("/list")
    public List<ReservationResponse> getAllReservations() {
        List<ReservationResponse> reservationResponses = reservationService.getAllReservations();
        return reservationResponses;
    }
}
