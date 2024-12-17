package com.restaurantsetup.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.restaurantsetup.dto.BookingTableRequest;
import com.restaurantsetup.dto.BookingTableResponse;
import com.restaurantsetup.entity.BookingTable;
import com.restaurantsetup.exception.ResourceAlreadyExistsException;
import com.restaurantsetup.exception.ResourceNotFoundException;
import com.restaurantsetup.repository.BookingTableRepository;

@Service
public class BookingTableService {
    @Autowired
    private BookingTableRepository bookingTableRepository;

    public BookingTableResponse createBookingTable(BookingTableRequest bookingTableRequest) {
        try {
            var table = bookingTableRepository.findByName(bookingTableRequest.name());
            if (table.isPresent()) {
                throw new ResourceAlreadyExistsException("BookingTable Already Exists.");
            } else {
                BookingTable bookingTable = new BookingTable(
                        null,
                        bookingTableRequest.name(),
                        bookingTableRequest.capacity(), "AVAILABLE");
                BookingTable savedBookingTable = bookingTableRepository.save(bookingTable);
                var bookingResponse = new BookingTableResponse(savedBookingTable.getId(), savedBookingTable.getName(),
                        savedBookingTable.getCapacity(), savedBookingTable.getStatus());
                return bookingResponse;
            }

        } catch (Exception e) {
            throw new Error(e.getMessage());
        }

    }

    public BookingTableResponse getBookingTableById(Long id) {
        try {
            BookingTable bookingTable = bookingTableRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Booking Table Not Found with this id " + id));
            var bookingResponse = new BookingTableResponse(bookingTable.getId(), bookingTable.getName(),
                    bookingTable.getCapacity(), bookingTable.getStatus());
            return bookingResponse;
        } catch (Exception e) {
            throw new Error(e.getMessage());
        }

    }

    public BookingTableResponse getBookingTableByName(String name) {
        BookingTable bookingTable = bookingTableRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Booking Table Not Found with this name" + name));
        var bookingResponse = new BookingTableResponse(bookingTable.getId(), bookingTable.getName(),
                bookingTable.getCapacity(), bookingTable.getStatus());
        return bookingResponse;
    }

    public void deleteBookingTable(Long bookingTableId) {
        bookingTableRepository.deleteById(bookingTableId);
    }

    public BookingTableResponse updateBookingTable(BookingTableRequest bookingTableRequest, Long id) {
        try {
            BookingTable bookingTable = bookingTableRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Booking Table Not Found with this id " + id));

            bookingTable.setName(bookingTableRequest.name());
            bookingTable.setCapacity(bookingTableRequest.capacity());
            bookingTable.setStatus(bookingTableRequest.status());
            BookingTable savedBookingTable = bookingTableRepository.save(bookingTable);

            var bookingResponse = new BookingTableResponse(savedBookingTable.getId(), savedBookingTable.getName(),
                    savedBookingTable.getCapacity(), savedBookingTable.getStatus());
            return bookingResponse;

        } catch (Exception e) {
            throw new Error(e.getMessage());
        }
    }

    public List<BookingTableResponse> getAllBookingTables() {
        try {
            List<BookingTable> bookingTables = bookingTableRepository.findAll();
            List<BookingTableResponse> bookingTableResponses = bookingTables.stream()
                    .map(table -> new BookingTableResponse(table.getId(), table.getName(), table.getCapacity(),
                            table.getStatus()))
                    .toList();
            return bookingTableResponses;
        } catch (Exception e) {
            throw new Error(e.getMessage());
        }

    }
}
