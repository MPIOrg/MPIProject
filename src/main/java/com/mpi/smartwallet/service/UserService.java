package com.mpi.smartwallet.service;

import com.mpi.smartwallet.dto.UserDTO;
import com.mpi.smartwallet.entity.User;
import com.mpi.smartwallet.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Aici transformăm DTO-ul validat în Entitate
    public User createUser(UserDTO userDTO) {
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setPasswordHash(userDTO.getPassword()); // Mai târziu vom pune criptare aici
        return userRepository.save(user);
    }
}