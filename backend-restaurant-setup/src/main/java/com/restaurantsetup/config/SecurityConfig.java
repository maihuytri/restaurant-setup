package com.restaurantsetup.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@SuppressWarnings("deprecation")
@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                return http.cors().and().csrf().disable()
                                .authorizeHttpRequests(
                                                auth -> auth
                                                                .requestMatchers("/auth/login", "/auth/signup")
                                                                .permitAll()
                                                                .requestMatchers("/users/**").permitAll()

                                                                .requestMatchers("/menuItems/**").permitAll()
                                                                .requestMatchers("/orders/**").permitAll()

                                                                .requestMatchers("/tables/**").permitAll()
                                                                .requestMatchers("/reservations/**").permitAll()
                                                                .anyRequest().authenticated())
                                .build();

        }
}