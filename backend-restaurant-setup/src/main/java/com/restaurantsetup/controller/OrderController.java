package com.restaurantsetup.controller;

import com.restaurantsetup.dto.OrderRequest;
import com.restaurantsetup.dto.OrderResponse;
import com.restaurantsetup.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping("")
    public ResponseEntity<List<OrderResponse>> fetchAllOrders() {
        return new ResponseEntity<>(orderService.getAllOrders(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        return new ResponseEntity<>(orderService.getOrderById(id), HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByUserId(@PathVariable Long userId) {
        return new ResponseEntity<>(orderService.getOrdersByUserId(userId), HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest orderRequest) {
        return new ResponseEntity<>(orderService.createOrder(orderRequest), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderResponse> editOrder(@PathVariable Long id, @RequestBody OrderRequest orderRequest) {
        return new ResponseEntity<>(orderService.editOrder(id, orderRequest), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> cancelOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok("Order with ID " + id + "has been successfully cancelled!");
    }

}
