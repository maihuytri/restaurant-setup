package com.restaurantsetup.controller;

import com.restaurantsetup.dto.APIResponse;
import com.restaurantsetup.dto.UserRequest;
import com.restaurantsetup.dto.UserResponse;
import com.restaurantsetup.entity.Role;
import com.restaurantsetup.entity.User;
import com.restaurantsetup.repository.UserRepository;
import com.restaurantsetup.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/users")
@PreAuthorize("hasRole('ROLE_MANAGER')")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<UserResponse> getAllUsers() {
        List<UserResponse> userResponses = new ArrayList<>();
        for (User user : userService.getAllUsers()) {
            UserResponse u = new UserResponse(user.getId(), user.getUsername(), user.getCustomerName(),
                    user.getContactTel(), user.getContactTel());
            userResponses.add(u);
        }

        return userResponses;
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<APIResponse> createUser(@RequestBody UserRequest userRequest) {
        APIResponse response = new APIResponse();
        try {
            if (userRepository.findByUsername(userRequest.username()).isPresent()) {
                response.setErrorCode(500);
                response.setMessage("Username already exists!");
                return ResponseEntity.ok(response);
            }

            User user = new User();
            user.setUsername(userRequest.username());
            user.setCustomerName(userRequest.customerName());
            user.setContactTel(userRequest.contactTel());
            user.setPassword(userRequest.password());
            user.setRole(userRequest.role().toLowerCase().equals("customer") ? Role.customer : Role.manager);

            userService.createUser(user);
            response.setErrorCode(200);
            response.setMessage("You have added staff successfully");
        } catch (DataIntegrityViolationException e) {
            response.setErrorCode(500);
            response.setMessage(e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody UserRequest userDetails) {
        User user = new User();

        user.setUsername(userDetails.username());
        user.setCustomerName(userDetails.customerName());
        user.setContactTel(userDetails.contactTel());
        // user.setPassword(userDetails.password());
        user.setRole(userDetails.role().toLowerCase().equals("customer") ? Role.customer : Role.manager);

        User updatedUser = userService.updateUser(id, user);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}