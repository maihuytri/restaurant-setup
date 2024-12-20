package com.restaurantsetup.controller;

import com.restaurantsetup.Util.OrderStatus;
import com.restaurantsetup.dto.APIResponse;
import com.restaurantsetup.dto.OrderRequest;
import com.restaurantsetup.dto.OrderResponse;
import com.restaurantsetup.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@PreAuthorize("hasRole('ROLE_CUSTOMER')")
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
    public ResponseEntity<APIResponse> createOrder(@RequestBody OrderRequest orderRequest) {
        APIResponse response = new APIResponse();
        try {
            OrderResponse orderResponse = orderService.createOrder(orderRequest);
            response.setErrorCode(200);
            response.setMessage("Order created successfully");
            response.setData(orderResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.setErrorCode(500);
            response.setMessage("Failed to create order: " + e.getMessage());
            response.setData(null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<APIResponse> cancelOrder(@PathVariable Long orderId,@RequestBody OrderRequest orderRequest) {
       APIResponse apiResponse = new APIResponse();
       try {
           OrderResponse orderResponse = orderService.cancelOrder(orderId);
           apiResponse.setErrorCode(200);
           apiResponse.setMessage("Order canceled successfully");
           apiResponse.setData(orderResponse);
           return ResponseEntity.ok(apiResponse);
       } catch (Exception e) {
           apiResponse.setErrorCode(500);
           apiResponse.setMessage("Failed to cancel order: " + e.getMessage());
           apiResponse.setData(null);
           return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
       }
    }

    @PutMapping("/{id}")
    public ResponseEntity<APIResponse> editOrder(@PathVariable Long id, @RequestBody OrderRequest orderRequest) {
       APIResponse apiResponse = new APIResponse();
       try {
           OrderResponse orderResponse = orderService.editOrder(id, orderRequest);
           apiResponse.setErrorCode(200);
           apiResponse.setMessage("Order updated successfully");
           apiResponse.setData(orderResponse);
           return ResponseEntity.ok(apiResponse);
       } catch(Exception e) {
           apiResponse.setErrorCode(500);
           apiResponse.setMessage("Failed to update order: " + e.getMessage());
           apiResponse.setData(null);
           return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
       }
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
