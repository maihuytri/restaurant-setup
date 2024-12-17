package com.restaurantsetup.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.restaurantsetup.entity.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    @Query(value = "select * from reservation r where r.user_id = :userId", nativeQuery = true)
    List<Reservation> findReservationsByUserId(Long userId);
}
