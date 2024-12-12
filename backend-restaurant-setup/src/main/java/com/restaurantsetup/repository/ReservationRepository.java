package com.restaurantsetup.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.restaurantsetup.entity.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

}
