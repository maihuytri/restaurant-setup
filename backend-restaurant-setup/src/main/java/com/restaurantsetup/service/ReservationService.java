package com.restaurantsetup.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.restaurantsetup.dto.ReservationRequest;
import com.restaurantsetup.dto.ReservationResponse;
import com.restaurantsetup.entity.BookingTable;
import com.restaurantsetup.entity.Reservation;
import com.restaurantsetup.exception.ResourceNotFoundException;
import com.restaurantsetup.repository.BookingTableRepository;
import com.restaurantsetup.repository.ReservationRepository;

@Service
public class ReservationService {
    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private BookingTableRepository bookingTableRepository;

    public ReservationResponse createReservation(ReservationRequest reservationRequest, Long bookingTableId) {
        try {
            BookingTable bookingTable = bookingTableRepository.findById(bookingTableId).orElseThrow(
                    () -> new ResourceNotFoundException("Booking Table Not Found with this id " + bookingTableId));

            if (bookingTable.getStatus() == "AVAILABLE") {
                Reservation reservation = new Reservation();
                reservation.setNote(reservationRequest.note());
                reservation.setTitle(reservationRequest.title());
                reservation.setDate(new Date());
                reservation.getTables().add(bookingTable);
                Reservation savedReservation = reservationRepository.save(reservation);

                ReservationResponse reservationResponse = new ReservationResponse(
                        savedReservation.getId(),
                        savedReservation.getNote(),
                        savedReservation.getTitle());

                return reservationResponse;
            }
            return null;

            // )
        } catch (Exception e) {
            throw new Error(e.getMessage());
        }
    }

    public void deleteReservation(Long id) {
        try {
            Reservation reservation = reservationRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Reservation Not Found with this id " + id));
            if (reservation != null) {
                reservationRepository.deleteById(id);
            }
        } catch (Exception e) {
            throw new Error(e.getMessage());
        }

    }
}
