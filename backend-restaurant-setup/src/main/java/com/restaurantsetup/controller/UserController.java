package com.restaurantsetup.controller;

import com.restaurantsetup.dto.APIResponse;
import com.restaurantsetup.entity.User;
import com.restaurantsetup.repository.UserRepository;
import com.restaurantsetup.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
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
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<APIResponse> createUser(@RequestBody User user) {
        System.out.println("createUser " + user.getUsername());
        APIResponse response = new APIResponse();
        try {
            if (userRepository.findByUsername(user.getUsername()).isPresent()) {
                System.out.println("Có");
                // throw new IllegalArgumentException("Username already exists!");
                response.setErrorCode(500);
                response.setMessage("Username already exists!");
                return ResponseEntity.ok(response);
            }

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
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        User updatedUser = userService.updateUser(id, userDetails);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}