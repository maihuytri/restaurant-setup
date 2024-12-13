package com.restaurantsetup.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String customerName;
    private String username;
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role;
    private String contactTel;

    @OneToMany(mappedBy = "user")
    private List<Order> orders;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private List<Reservation> reservations;

    public User(String customerName, String contactTel) {
        this.customerName = customerName;
        this.contactTel = contactTel;
    }

    // Constructors
    public User(String customerName, Role role, String contactTel) {
        this.customerName = customerName;
        this.role = role;
        this.contactTel = contactTel;
    }
}
