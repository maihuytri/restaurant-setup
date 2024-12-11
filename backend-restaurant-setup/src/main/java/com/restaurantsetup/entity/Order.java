package com.restaurantsetup.entity;


import com.restaurantsetup.Util.OrderStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "\"Order\"")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String orderDate;
    private Integer quantity;
    private double price;
    private String note;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;


    //@ManyToOne
    //@JoinColumn(name = "customer_id")
   // private Customer customer;


    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    private List<MenuItem> menuItems;

}
