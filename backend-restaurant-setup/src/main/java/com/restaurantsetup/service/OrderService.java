package com.restaurantsetup.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.restaurantsetup.Util.OrderStatus;
import com.restaurantsetup.dto.MenuItemRequest;
import com.restaurantsetup.dto.MenuItemResponse;
import com.restaurantsetup.dto.OrderRequest;
import com.restaurantsetup.dto.OrderResponse;
import com.restaurantsetup.entity.MenuItem;
import com.restaurantsetup.entity.Order;
import com.restaurantsetup.entity.User;
import com.restaurantsetup.repository.MenuItemRepository;
import com.restaurantsetup.repository.OrderRepository;
import com.restaurantsetup.repository.UserRepository;

@Service
public class OrderService {
    @Autowired
    OrderRepository orderRepository;

    @Autowired
    MenuItemRepository menuItemRepository;

    @Autowired
    UserRepository userRepository;

    // get all orders
    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(this::convertToOrderResponse).collect(Collectors.toList());
    }

    // get order by order Id
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(
                () -> new RuntimeException("Order not found with id: " + orderId));
        return convertToOrderResponse(order);
    }

    // get orders by userId
    public List<OrderResponse> getOrdersByUserId(Long userId) {
        List<Order> orders = orderRepository.findOrdersByUser_Id(userId);
        return orders.stream().map(this::convertToOrderResponse).collect(Collectors.toList());
    }

    // create an order
    public OrderResponse createOrder(OrderRequest orderRequest) {
        // get the menuItem
        MenuItemRequest menuItemRequest = orderRequest.menuItemRequest();
        MenuItem menuItem = menuItemRepository.findById(menuItemRequest.id()).orElseThrow(
                () -> new IllegalArgumentException("Menuitem not found"));
        User user = userRepository.findByContactTel(orderRequest.contactTel())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setCustomerName(orderRequest.customerName());
                    newUser.setContactTel(orderRequest.contactTel());
                    return userRepository.save(newUser);
                });
        // create order
        Order order = new Order();
        order.setMenuItem(menuItem);
        order.setMenuItemCount(orderRequest.menuItemCount());
        order.setUser(user);
        order.setNote(orderRequest.note());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.setTotalPrice(orderRequest.menuItemCount() * menuItem.getPrice());
        Order savedOrder = orderRepository.save(order);
        return convertToOrderResponse(savedOrder);
    }

    // update order
    public OrderResponse editOrder(Long orderId, OrderRequest updatedOrderRequest) {
        Order existingOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with Id: " + orderId));
        MenuItemRequest updatedMenuItemRequest = updatedOrderRequest.menuItemRequest();
        MenuItem updateMenuItem = menuItemRepository.findById(updatedMenuItemRequest.id())
                .orElseThrow(() -> new IllegalArgumentException("Menuitem not found"));
        System.out.println("tsai test : " + updateMenuItem.getName());
        existingOrder.setMenuItem(updateMenuItem);
        existingOrder.setMenuItemCount(updatedOrderRequest.menuItemCount());
        existingOrder.setNote(updatedOrderRequest.note());
        existingOrder.setTotalPrice(updatedOrderRequest.menuItemCount() * updateMenuItem.getPrice());

        User updateUser = userRepository.findByContactTel(updatedOrderRequest.contactTel())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setCustomerName(updatedOrderRequest.customerName());
                    newUser.setContactTel(updatedOrderRequest.contactTel());
                    return userRepository.save(newUser);
                });
        existingOrder.setUser(updateUser);
        Order updatedOrder = orderRepository.save(existingOrder);
        return convertToOrderResponse(updatedOrder);
    }

    // delete order by order id
    public void deleteOrder(Long orderId) {
        Order existingOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        orderRepository.deleteById(orderId);

    }

    private OrderResponse convertToOrderResponse(Order order) {
        MenuItem menuItem = order.getMenuItem();
        MenuItemResponse menuItemResponse = new MenuItemResponse(
                menuItem.getId(),
                menuItem.getName(),
                menuItem.getDescription(),
                menuItem.getPrice(),
                menuItem.getCategory());
        return new OrderResponse(
                order.getId(),
                order.getUser().getCustomerName(),
                order.getUser().getContactTel(),
                order.getOrderDate(),
                order.getNote(),
                order.getStatus(),
                menuItemResponse,
                order.getTotalPrice(),
                order.getMenuItemCount());
    }
}
