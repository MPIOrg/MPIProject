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
}