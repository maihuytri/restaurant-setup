package com.restaurantsetup.entity;


import com.restaurantsetup.Util.OrderStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
    @DateTimeFormat
    private LocalDateTime orderDate = LocalDateTime.now();// change to localdate instead of string
    private Integer menuItemCount;
    private double totalPrice;
    private String note;
    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;//

//    @OneToMany(cascade = CascadeType.ALL)
//    @JoinColumn(name = "order_id", referencedColumnName = "id")
//    private List<MenuItem> menuItems;

    @OneToOne
    @JoinColumn(name = "menuItem_id", referencedColumnName = "id")
    private MenuItem menuItem;
}
