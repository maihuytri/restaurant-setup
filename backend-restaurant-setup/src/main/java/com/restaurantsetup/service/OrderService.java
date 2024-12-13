package com.restaurantsetup.service;

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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    @Autowired
    OrderRepository orderRepository;

    @Autowired
    MenuItemRepository menuItemRepository;

    @Autowired
    UserRepository userRepository;

    //get all orders
    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(this::convertToOrderResponse).collect(Collectors.toList());
    }

    //get order by order Id
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(
                () -> new RuntimeException("Order not found with id: " + orderId)
        );
        return convertToOrderResponse(order);
    }

    //get orders by userId
    public List<OrderResponse> getOrdersByUserId(Long userId) {
        List<Order> orders = orderRepository.findOrdersByUser_Id(userId);
        return orders.stream().map(this::convertToOrderResponse).collect(Collectors.toList());
    }

    //create an order
    public OrderResponse createOrder(OrderRequest orderRequest) {
        //get the menuItem
        MenuItemRequest menuItemRequest = orderRequest.menuItemRequest();
        MenuItem menuItem = menuItemRepository.findMenuItemByName(menuItemRequest.name());

        User user = userRepository.findByContactTel(orderRequest.contactTel())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setCustomerName(orderRequest.customerName());
                    newUser.setContactTel(orderRequest.contactTel());
                    return userRepository.save(newUser);
                });
        //create order
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

    //update order
    public OrderResponse editOrder(Long orderId, OrderRequest orderRequest) {
        Order existingOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with Id: " + orderId));

        MenuItemRequest menuItemRequest = orderRequest.menuItemRequest();
        if (menuItemRequest != null) {
            MenuItem menuItem = existingOrder.getMenuItem();
            menuItem.setName(menuItemRequest.name());
            menuItem.setDescription(menuItemRequest.description());
            menuItem.setPrice(menuItemRequest.price());
            menuItem.setCategory(menuItemRequest.category());
            menuItemRepository.save(menuItem);
        }
        User user = existingOrder.getUser();
        if (orderRequest.customerName() != null && !orderRequest.customerName().isBlank()) {
            user.setCustomerName(orderRequest.customerName());
        }
        if (orderRequest.contactTel() != null && !orderRequest.contactTel().isBlank()) {
            user.setContactTel(orderRequest.contactTel());
        }
        userRepository.save(user);

        if (orderRequest.menuItemCount() != null && orderRequest.menuItemCount() > 0) {
            existingOrder.setMenuItemCount(orderRequest.menuItemCount());
            existingOrder.setTotalPrice(orderRequest.menuItemCount() * existingOrder.getMenuItem().getPrice());
        }
        existingOrder.setNote(orderRequest.note());
        existingOrder.setStatus(OrderStatus.PENDING);
        Order updatedOrder = orderRepository.save(existingOrder);
        return convertToOrderResponse(updatedOrder);
    }

    //delete order by order id
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
                menuItem.getCategory()
        );
        return new OrderResponse(
                order.getId(),
                order.getUser().getCustomerName(),
                order.getUser().getContactTel(),
                order.getOrderDate(),
                order.getNote(),
                order.getStatus(),
                menuItemResponse,
                order.getTotalPrice()
        );
    }


}
