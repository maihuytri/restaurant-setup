package com.restaurantsetup.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurantsetup.dto.APIResponse;
import com.restaurantsetup.dto.LoginRequest;
import com.restaurantsetup.dto.LoginResponse;
import com.restaurantsetup.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<APIResponse> login(@RequestBody LoginRequest loginRequest) {
        System.out.println("Login");
        APIResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }
}