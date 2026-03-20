package com.mpi.smartwallet.controller;

import com.mpi.smartwallet.dto.UserDTO;
import com.mpi.smartwallet.entity.User;
import com.mpi.smartwallet.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // AICI INTERVINE VALIDAREA
    @PostMapping
    public User createUser(@Valid @RequestBody UserDTO userDTO) {
        return userService.createUser(userDTO);
    }
    
 // Endpoint-ul de Login
    @PostMapping("/login")
    public java.util.Map<String, Object> login(@jakarta.validation.Valid @RequestBody com.mpi.smartwallet.dto.LoginDTO loginDTO) {
        return userService.loginUser(loginDTO);
    }
}