package com.restaurantsetup.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.restaurantsetup.Util.MenuItemStatus;
import com.restaurantsetup.Util.OrderStatus;
import com.restaurantsetup.dto.APIResponse;
import com.restaurantsetup.dto.MenuItemRequest;
import com.restaurantsetup.dto.MenuItemResponse;
import com.restaurantsetup.dto.OrderRequest;
import com.restaurantsetup.dto.OrderResponse;
import com.restaurantsetup.entity.MenuItem;
import com.restaurantsetup.entity.Order;
import com.restaurantsetup.entity.User;
import com.restaurantsetup.exception.ResourceNotFoundException;
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
    public APIResponse createOrder(Long userId, OrderRequest orderRequest) {
        APIResponse response = new APIResponse();
        // get the menuItem
        MenuItemRequest menuItemRequest = orderRequest.menuItemRequest();
        MenuItem menuItem = menuItemRepository.findById(menuItemRequest.id()).orElseThrow(
                () -> new ResourceNotFoundException("Menuitem not found"));
        // check if the menuItem is unavailable
        if (MenuItemStatus.UNAVAILABLE.name().equals(menuItem.getStatus())) {
            response.setErrorCode(500);
            response.setMessage("The selected menu item is currently unavailable.");
            return response;
        }
        if (menuItem.getStock() - orderRequest.menuItemCount() < 0) {
            response.setErrorCode(500);
            response.setMessage("Insufficient inventory for MenuItem:" + menuItem.getName() + ". Available stock: "
                    + menuItem.getStock());
            return response;
        }
        menuItem.setStock(menuItem.getStock() - orderRequest.menuItemCount());
        if (menuItem.getStock() == 0) {
            menuItem.setStatus(MenuItemStatus.UNAVAILABLE.name());
        }
        menuItemRepository.save(menuItem);
        // User user = userRepository.findByContactTel(orderRequest.contactTel())
        // .orElseGet(() -> {
        // User newUser = new User();
        // newUser.setCustomerName(orderRequest.customerName());
        // newUser.setContactTel(orderRequest.contactTel());
        // return userRepository.save(newUser);
        // });

        User user = userRepository.getById(userId);

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
        response.setErrorCode(200);
        response.setData(convertToOrderResponse(savedOrder));

        return response;
    }
    // update order
    public APIResponse editOrder(Long orderId, OrderRequest updatedOrderRequest) {
        APIResponse response = new APIResponse();
        Order existingOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with Id: " + orderId));
        MenuItemRequest updatedMenuItemRequest = updatedOrderRequest.menuItemRequest();
        MenuItem menuItem = menuItemRepository.findById(updatedMenuItemRequest.id())
                .orElseThrow(() -> new ResourceNotFoundException("Menuitem not found"));
        if (MenuItemStatus.UNAVAILABLE.name().equals(menuItem.getStatus())) {
            // throw new IllegalArgumentException("The selected menu item is currently
            // unavailable.");
            response.setErrorCode(500);
            response.setMessage("The selected menu item is currently unavailable.");
            return response;
        }
        if (menuItem.getStock() - updatedOrderRequest.menuItemCount() < 0) {
            response.setErrorCode(500);
            response.setMessage("Insufficient inventory for MenuItem:" + menuItem.getName() + ". Available stock: "
                    + menuItem.getStock());
            return response;
        }
        menuItem.setStock(menuItem.getStock() + existingOrder.getMenuItemCount() - updatedOrderRequest.menuItemCount());
        if (menuItem.getStock() == 0) {
            menuItem.setStatus(MenuItemStatus.UNAVAILABLE.name());
        }
        menuItemRepository.save(menuItem);
        existingOrder.setMenuItem(menuItem);
        existingOrder.setMenuItemCount(updatedOrderRequest.menuItemCount());
        existingOrder.setNote(updatedOrderRequest.note());
        existingOrder.setStatus(OrderStatus.getEnumByString(updatedOrderRequest.status()));
        existingOrder.setTotalPrice(updatedOrderRequest.menuItemCount() * menuItem.getPrice());

        /*
         * User updateUser =
         * userRepository.findByContactTel(updatedOrderRequest.contactTel())
         * .orElseGet(() -> {
         * User newUser = new User();
         * newUser.setCustomerName(updatedOrderRequest.customerName());
         * newUser.setContactTel(updatedOrderRequest.contactTel());
         * return userRepository.save(newUser);
         * });
         * existingOrder.setUser(updateUser);
         */
        Order updatedOrder = orderRepository.save(existingOrder);
        response.setErrorCode(200);
        response.setData(convertToOrderResponse(updatedOrder));

        return response;
    }

    // delete order by order id
    public void deleteOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(
                () -> new ResourceNotFoundException("Order not found with id: " + orderId));
        if (order.getStatus() == OrderStatus.COMPLETED || order.getStatus() == OrderStatus.IN_PROGRESS) {
            throw new IllegalStateException("Cannot delete an order that is COMPLETED or IN_PROGRESS.");
        }
        MenuItem menuItem = order.getMenuItem();
        menuItem.setStock(menuItem.getStock() + order.getMenuItemCount());
        if (menuItem.getStock() > 0 && MenuItemStatus.UNAVAILABLE.name().equals(menuItem.getStatus())) {
            menuItem.setStatus(MenuItemStatus.AVAILABLE.name());
        }
        menuItemRepository.save(menuItem);
        orderRepository.deleteById(orderId);
    }

    // cancel order (mark status to cancel)
    public OrderResponse cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(
                () -> new ResourceNotFoundException("Order not found with id: " + orderId));
        if (order.getStatus() == OrderStatus.COMPLETED) {
            throw new IllegalStateException("Order is COMPLETED and can not cancel.");
        }
        MenuItem menuItem = order.getMenuItem();
        menuItem.setStock(menuItem.getStock() + order.getMenuItemCount());
        if (menuItem.getStock() > 0 && MenuItemStatus.UNAVAILABLE.name().equals(menuItem.getStatus())) {
            menuItem.setStatus(MenuItemStatus.AVAILABLE.name());
        }
        menuItemRepository.save(menuItem);
        order.setStatus(OrderStatus.CANCELED);
        Order canceledOrder = orderRepository.save(order);
        return convertToOrderResponse(canceledOrder);
    }

    public OrderResponse updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));
        if (order.getStatus() == OrderStatus.COMPLETED || order.getStatus() == OrderStatus.CANCELED) {
            throw new IllegalStateException("Cannot change the status of a completed or canceled order.");
        }
        // Update the status
        if (newStatus.equals("COMPLETED")) {
            order.setStatus(OrderStatus.COMPLETED);
        } else if (newStatus.equals("IN_PROGRESS")) {
            order.setStatus(OrderStatus.IN_PROGRESS);
        } else if (newStatus.equals("CANCELED")) {
            order.setStatus(OrderStatus.CANCELED);
        }
        Order updatedOrder = orderRepository.save(order);
        return convertToOrderResponse(updatedOrder);
    }

    private OrderResponse convertToOrderResponse(Order order) {
        MenuItem menuItem = order.getMenuItem();
        MenuItemResponse menuItemResponse = new MenuItemResponse(
                menuItem.getId(),
                menuItem.getName(),
                menuItem.getDescription(),
                menuItem.getPrice(),
                menuItem.getCategory(),
                menuItem.getStock());
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
