package com.mpi.smartwallet.service;

import com.mpi.smartwallet.dto.LoginDTO;
import com.mpi.smartwallet.dto.UserDTO;
import com.mpi.smartwallet.entity.User;
import com.mpi.smartwallet.exception.ResourceNotFoundException;
import com.mpi.smartwallet.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void testCreateUser_Success() {
        UserDTO dto = new UserDTO();
        dto.setUsername("testuser");
        dto.setEmail("test@test.com");
        dto.setPassword("parola123");

        User savedUser = new User();
        savedUser.setId(1);
        savedUser.setUsername("testuser");

        when(passwordEncoder.encode("parola123")).thenReturn("hash123");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        User result = userService.createUser(dto);

        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testLoginUser_Success() {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("test@test.com");
        loginDTO.setPassword("parola123");

        User mockUser = new User();
        mockUser.setId(1);
        mockUser.setUsername("testuser");
        mockUser.setPasswordHash("hash123");

        when(userRepository.findByEmail("test@test.com")).thenReturn(mockUser);
        when(passwordEncoder.matches("parola123", "hash123")).thenReturn(true);

        Map<String, Object> result = userService.loginUser(loginDTO);

        assertEquals("Login reușit!", result.get("message"));
        assertEquals(1, result.get("userId"));
    }

    @Test
    void testLoginUser_InvalidPassword_ThrowsException() {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("test@test.com");
        loginDTO.setPassword("parola_gresita");

        User mockUser = new User();
        mockUser.setPasswordHash("hash123");

        when(userRepository.findByEmail("test@test.com")).thenReturn(mockUser);
        when(passwordEncoder.matches("parola_gresita", "hash123")).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> {
            userService.loginUser(loginDTO);
        });
    }
}