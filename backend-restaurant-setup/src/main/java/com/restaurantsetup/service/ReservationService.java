package com.restaurantsetup.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.restaurantsetup.dto.BookingTableRequest;
import com.restaurantsetup.dto.BookingTableResponse;
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
    @Autowired
    private BookingTableService bookingTableService;

    public ReservationResponse createReservation(ReservationRequest reservationRequest, Long bookingTableId) {
        try {
            BookingTable bookingTable = bookingTableRepository.findById(bookingTableId).orElseThrow(
                    () -> new ResourceNotFoundException("Booking Table Not Found with this id " + bookingTableId));

            if (bookingTable.getStatus().equals("AVAILABLE")) {
                Reservation reservation = new Reservation();
                reservation.setNote(reservationRequest.note());
                reservation.setTitle(reservationRequest.title());
                LocalDate now = LocalDate.now();
                reservation.setDate(LocalDate.of(now.getYear(), now.getMonth(), now.getDayOfMonth()));
                reservation.setTime(reservationRequest.time());
                reservation.setBookingTable(bookingTable);
                Reservation savedReservation = reservationRepository.save(reservation);
                savedReservation.getBookingTable().setStatus("RESERVED");
                bookingTableService.updateBookingTable(
                        new BookingTableRequest(bookingTable.getName(), bookingTable.getCapacity(), "RESERVED"),
                        bookingTableId);

                ReservationResponse reservationResponse = new ReservationResponse(
                        savedReservation.getId(),
                        savedReservation.getNote(),
                        savedReservation.getTitle(),
                        savedReservation.getDate(),
                        savedReservation.getTime(),
                        new BookingTableResponse(savedReservation.getBookingTable().getId(),
                                savedReservation.getBookingTable().getName(),
                                savedReservation.getBookingTable().getCapacity(),
                                savedReservation.getBookingTable().getStatus()));

                return reservationResponse;
            } else {
                throw new RuntimeException("This table is already reserved");
            }

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

    public ReservationResponse getReservationById(Long id) {
        try {
            Reservation reservation = reservationRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Reservation Not Found with this id " + id));
            ReservationResponse reservationResponse = new ReservationResponse(reservation.getId(),
                    reservation.getNote(), reservation.getTitle(), reservation.getDate(), reservation.getTime(),
                    new BookingTableResponse(reservation.getBookingTable().getId(),
                            reservation.getBookingTable().getName(), reservation.getBookingTable().getCapacity(),
                            reservation.getBookingTable().getStatus()));
            return reservationResponse;
        } catch (Exception e) {
            throw new Error(e.getMessage());
        }
    }

    public List<ReservationResponse> getAllReservations() {
        try {
            List<ReservationResponse> reservationResponses = reservationRepository.findAll().stream()
                    .map(res -> new ReservationResponse(res.getId(), res.getNote(), res.getTitle(), res.getDate(),
                            res.getTime(),
                            new BookingTableResponse(res.getBookingTable().getId(), res.getBookingTable().getName(),
                                    res.getBookingTable().getCapacity(), res.getBookingTable().getStatus())))
                    .toList();
            return reservationResponses;
        } catch (Exception e) {
            throw new Error(e.getMessage());
        }
    }
}
