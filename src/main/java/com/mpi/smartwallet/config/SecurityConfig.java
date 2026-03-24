package com.mpi.smartwallet.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Dezactivăm CSRF pentru a permite cererile POST din Swagger/Frontend
            .csrf(csrf -> csrf.disable())
            
            // 2. Configurăm permisiunile de acces
            .authorizeHttpRequests(auth -> auth
                // Permitem accesul liber la documentația Swagger
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                
                // Permitem accesul liber DOAR la înregistrare și login
                // Notă: Verifică dacă în Controller ai /api/users/register sau doar /api/users
                .requestMatchers("/api/users", "/api/users/register", "/api/users/login").permitAll()
                
                // Orice altă cerere (ex: /api/transactions) necesită autentificare
                .anyRequest().authenticated()
            )
            // 3. Activăm suportul pentru autentificare de bază (util pentru testare)
            .httpBasic(Customizer.withDefaults());
        
        return http.build();
    }

    // 4. Bean pentru criptarea parolelor cu BCrypt
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}