package com.restaurantsetup.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurantsetup.dto.APIResponse;
import com.restaurantsetup.dto.OrderRequest;
import com.restaurantsetup.dto.OrderResponse;
import com.restaurantsetup.service.OrderService;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/orders")
@PreAuthorize("hasRole('ROLE_MANAGER') or hasRole('ROLE_CUSTOMER')")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping("")
    public ResponseEntity<List<OrderResponse>> fetchAllOrders(HttpServletRequest request) {
        Claims claim = (Claims) request.getAttribute("claims");
        String role = claim.get("role").toString();
        Long userId = Long.parseLong(claim.get("userId").toString());
        if (role.equals("ROLE_MANAGER"))
            return new ResponseEntity<>(orderService.getAllOrders(), HttpStatus.OK);
        return new ResponseEntity<>(orderService.getOrdersByUserId(userId), HttpStatus.OK);
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
    public ResponseEntity<APIResponse> createOrder(@RequestBody OrderRequest orderRequest) {
        return ResponseEntity.ok(orderService.createOrder(orderRequest));
    }

    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(@PathVariable Long orderId,
            @RequestBody OrderRequest orderRequest) {
        return new ResponseEntity<>(orderService.cancelOrder(orderId), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<APIResponse> editOrder(@PathVariable Long id, @RequestBody OrderRequest orderRequest) {
        return ResponseEntity.ok(orderService.editOrder(id, orderRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok("Order with ID " + id + "has been successfully cancelled!");
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody String newStatus) {
        OrderResponse updatedOrder = orderService.updateOrderStatus(orderId, newStatus);
        return ResponseEntity.ok(updatedOrder);
    }
}
