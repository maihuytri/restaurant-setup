package com.restaurantsetup.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.restaurantsetup.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByContactTel(String tel);
   // Optional<User> findByCustomerNameAndAndContactTel(String customerName, String contactTel);

}
