package com.restaurantsetup.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class BookingTable {
    @Id
    private Long id;

    private String name;
    private Integer capacity;


}
