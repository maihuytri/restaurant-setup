package com.restaurantsetup.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.restaurantsetup.entity.BookingTable;

public interface BookingTableRepository extends JpaRepository<BookingTable, Long> {
    @Query(value = "select t.id,t.name,t.capacity,t.status from booking_table t where t.name=?1", nativeQuery = true)
    Optional<BookingTable> findByName(String name);

}
