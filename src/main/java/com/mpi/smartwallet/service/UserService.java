package com.mpi.smartwallet.service;

import com.mpi.smartwallet.dto.UserDTO;
import com.mpi.smartwallet.entity.User;
import com.mpi.smartwallet.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // Aduce mașinăria de criptat

    // Ambele sunt injectate automat de Spring
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(UserDTO userDTO) {
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        
        // Parola este transformată într-un Hash indescifrabil 
        user.setPasswordHash(passwordEncoder.encode(userDTO.getPassword())); 
        
        return userRepository.save(user);
    }
    
 // Funcția de Login
    public java.util.Map<String, Object> loginUser(com.mpi.smartwallet.dto.LoginDTO loginDTO) {
        // 1. Căutăm user-ul după email
        User user = userRepository.findByEmail(loginDTO.getEmail());
        
        // Dacă nu există user-ul sau parola nu se potrivește
        if (user == null || !passwordEncoder.matches(loginDTO.getPassword(), user.getPasswordHash())) {
            throw new com.mpi.smartwallet.exception.ResourceNotFoundException("Email sau parolă incorectă!");
        }

        // 2. Dacă e totul ok, construim un răspuns curat (FĂRĂ parola hash-uită)
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("message", "Login reușit!");
        response.put("userId", user.getId());
        response.put("username", user.getUsername());
        
        return response;
    }
}