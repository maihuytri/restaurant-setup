package com.restaurantsetup.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurantsetup.dto.BookingTableRequest;
import com.restaurantsetup.dto.BookingTableResponse;
import com.restaurantsetup.service.BookingTableService;

@RestController
@RequestMapping("/tables")
@PreAuthorize("hasRole('ROLE_MANAGER')")
public class BookingTableController {
    @Autowired
    private BookingTableService bookingTableService;

    @PostMapping("/")
    public ResponseEntity<?> createBookingTable(@RequestBody BookingTableRequest bookingTableRequest) {
        BookingTableResponse bookingTableResponse = bookingTableService.createBookingTable(bookingTableRequest);
        return new ResponseEntity<BookingTableResponse>(bookingTableResponse, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateResponseEntity(@RequestBody BookingTableRequest bookingTableRequest,
            @PathVariable Long id) {
        BookingTableResponse bookingTableResponse = bookingTableService.updateBookingTable(bookingTableRequest, id);
        return new ResponseEntity<BookingTableResponse>(bookingTableResponse,
                HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBookingTable(@PathVariable Long id) {
        bookingTableService.deleteBookingTable(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
