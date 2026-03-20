package com.mpi.smartwallet.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Oprim scutul CSRF ca să putem face cereri POST din Swagger și Frontend
            .csrf(csrf -> csrf.disable())
            
            // 2. Setăm regulile de acces (cine are voie și unde)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll() // Lăsăm documentația complet liberă
                .requestMatchers("/api/**").permitAll() // Lăsăm API-ul liber (momentan, pentru dezvoltare)
                .anyRequest().authenticated()
            );
        
        return http.build();
    }

    // 3. Creăm o "mașinărie" de criptat parole, pe care o vom folosi în tot proiectul
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}