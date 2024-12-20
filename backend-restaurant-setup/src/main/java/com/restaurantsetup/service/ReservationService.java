package com.restaurantsetup.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.restaurantsetup.dto.BookingTableRequest;
import com.restaurantsetup.dto.BookingTableResponse;
import com.restaurantsetup.dto.ReservationRequest;
import com.restaurantsetup.dto.ReservationResponse;
import com.restaurantsetup.dto.UserResponse;
import com.restaurantsetup.entity.BookingTable;
import com.restaurantsetup.entity.Reservation;
import com.restaurantsetup.entity.User;
import com.restaurantsetup.exception.ResourceNotFoundException;
import com.restaurantsetup.repository.BookingTableRepository;
import com.restaurantsetup.repository.ReservationRepository;
import com.restaurantsetup.repository.UserRepository;

@Service
public class ReservationService {
    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private BookingTableRepository bookingTableRepository;
    @Autowired
    private BookingTableService bookingTableService;
    @Autowired
    private UserRepository userRepository;

    public ReservationResponse createReservation(ReservationRequest reservationRequest, Long bookingTableId,
            Long userId) {
        try {

            BookingTable bookingTable = bookingTableRepository.findById(bookingTableId).orElseThrow(
                    () -> new ResourceNotFoundException("Booking Table Not Found with this id " + bookingTableId));

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User Not Found with this id " + userId));

            if (bookingTable.getStatus().equals("AVAILABLE")) {
                Reservation reservation = new Reservation();
                reservation.setNote(reservationRequest.note());
                reservation.setTitle(reservationRequest.title());
                reservation.setStatus("PENDING");
                LocalDateTime now = LocalDateTime.now();
                reservation.setDate(LocalDateTime.of(now.getYear(), now.getMonth(), now.getDayOfMonth(), now.getHour(),
                        now.getMinute()));
                reservation.setTime(reservationRequest.time());
                reservation.setBookingTable(bookingTable);
                reservation.setUser(user);
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
                        savedReservation.getStatus(),
                        new BookingTableResponse(savedReservation.getBookingTable().getId(),
                                savedReservation.getBookingTable().getName(),
                                savedReservation.getBookingTable().getCapacity(),
                                savedReservation.getBookingTable().getStatus()),
                        new UserResponse(savedReservation.getUser().getId(),
                                savedReservation.getUser().getUsername(),
                                savedReservation.getUser().getCustomerName(),
                                savedReservation.getUser().getContactTel(),
                                savedReservation.getUser().getRole().name()));

                return reservationResponse;
            } else {
                throw new RuntimeException("This table is already reserved");
            }

            // )
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new Error(e.getMessage());
        }
    }

    public ReservationResponse editReservation(ReservationRequest reservationRequest, Long reservationId) {
        try {
            Reservation reservation = reservationRepository.findById(reservationId)
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Reservation Not Found with this id " + reservationId));
            if (reservationRequest.title() != null) {
                reservation.setTitle(reservationRequest.title());
            }
            if (reservationRequest.note() != null) {
                reservation.setNote(reservationRequest.note());
            }
            if (reservationRequest.time() != null) {
                reservation.setTime(reservationRequest.time());
            }
            if (reservationRequest.status() != null) {
                reservation.setStatus(reservationRequest.status());
            }

            Reservation savedReservation = reservationRepository.save(reservation);
            ReservationResponse reservationResponse = new ReservationResponse(
                    savedReservation.getId(),
                    savedReservation.getNote(),
                    savedReservation.getTitle(),
                    savedReservation.getDate(),
                    savedReservation.getTime(),
                    savedReservation.getStatus(),
                    new BookingTableResponse(savedReservation.getBookingTable().getId(),
                            savedReservation.getBookingTable().getName(),
                            savedReservation.getBookingTable().getCapacity(),
                            savedReservation.getBookingTable().getStatus()),
                    new UserResponse(savedReservation.getUser().getId(),
                            savedReservation.getUser().getUsername(),
                            savedReservation.getUser().getCustomerName(),
                            savedReservation.getUser().getContactTel(),
                            savedReservation.getUser().getRole().name()));

            return reservationResponse;

            // )
        } catch (Exception e) {
            System.out.println(e.getMessage());
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

    public void cancelReservation(Long id) {
        try {
            Reservation reservation = reservationRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Reservation Not Found with this id " + id));
            BookingTable bookingTable = reservation.getBookingTable();
            bookingTable.setStatus("AVAILABLE");
            bookingTableService.updateBookingTable(new BookingTableRequest(bookingTable.getName(),
                    bookingTable.getCapacity(), bookingTable.getStatus()), bookingTable.getId());
            reservation.setStatus("CANCELED");
            reservationRepository.save(reservation);
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
                    reservation.getStatus(),
                    new BookingTableResponse(reservation.getBookingTable().getId(),
                            reservation.getBookingTable().getName(), reservation.getBookingTable().getCapacity(),
                            reservation.getBookingTable().getStatus()),
                    new UserResponse(reservation.getUser().getId(),
                            reservation.getUser().getUsername(),
                            reservation.getUser().getCustomerName(),
                            reservation.getUser().getContactTel(),
                            reservation.getUser().getRole().name()));
            return reservationResponse;
        } catch (Exception e) {
            throw new Error(e.getMessage());
        }
    }

    public List<ReservationResponse> getAllReservations() {
        try {
            List<ReservationResponse> reservationResponses = reservationRepository.findAll().stream()
                    .map(res -> new ReservationResponse(res.getId(), res.getNote(), res.getTitle(), res.getDate(),
                            res.getTime(), res.getStatus(),
                            new BookingTableResponse(res.getBookingTable().getId(), res.getBookingTable().getName(),
                                    res.getBookingTable().getCapacity(), res.getBookingTable().getStatus()),
                            new UserResponse(res.getUser().getId(),
                                    res.getUser().getUsername(),
                                    res.getUser().getCustomerName(),
                                    res.getUser().getContactTel(),
                                    res.getUser().getRole().name())))
                    .toList();
            return reservationResponses;
        } catch (Exception e) {
            throw new Error(e.getMessage());
        }
    }

    public List<ReservationResponse> getAllReservationsByUserId(Long userId) {
        try {
            userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User Not Found with this id " + userId));
            List<ReservationResponse> reservationResponses = reservationRepository.findReservationsByUserId(userId)
                    .stream()
                    .map(res -> new ReservationResponse(res.getId(), res.getNote(), res.getTitle(), res.getDate(),
                            res.getTime(),
                            res.getStatus(),
                            new BookingTableResponse(res.getBookingTable().getId(), res.getBookingTable().getName(),
                                    res.getBookingTable().getCapacity(), res.getBookingTable().getStatus()),
                            new UserResponse(res.getUser().getId(),
                                    res.getUser().getUsername(),
                                    res.getUser().getCustomerName(),
                                    res.getUser().getContactTel(),
                                    res.getUser().getRole().name())))
                    .toList();
            return reservationResponses;
        } catch (Exception e) {
            throw new Error(e.getMessage());
        }
    }

}
