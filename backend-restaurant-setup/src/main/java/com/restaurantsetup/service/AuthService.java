package com.restaurantsetup.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.restaurantsetup.config.JwtUtil;
import com.restaurantsetup.dto.APIResponse;
import com.restaurantsetup.dto.LoginRequest;
import com.restaurantsetup.dto.LoginResponse;
import com.restaurantsetup.entity.User;
import com.restaurantsetup.repository.UserRepository;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public APIResponse login(LoginRequest loginRequest) {
        APIResponse response = new APIResponse();

        try {
            // Check if user exists
            User user = userRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> {
                        return new IllegalArgumentException("Invalid username or password");
                    });

            // Check password
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                response.setErrorCode(401);
                response.setMessage("Invalid password");
                response.setData(null);
                return response;
            }

            // Generate JWT token
            String token = jwtUtil.generateToken(user.getId(), user.getUsername(),
                    "ROLE_" + user.getRole().toString().toUpperCase());
            LoginResponse loginResponse = new LoginResponse(token, user.getUsername(), user.getRole().toString());

            // Success response
            System.out.println("login Token " + token);
            response.setErrorCode(200);
            response.setMessage("Login successful");
            response.setData(loginResponse);
            return response;

        } catch (Exception e) {
            // Handle unexpected errors
            response.setErrorCode(500);
            response.setMessage(e.getMessage());
            response.setData(null);
            return response;
        }
    }
}