package com.mpi.smartwallet.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserDTO {
    
    @NotBlank(message = "Username-ul este obligatoriu")
    private String username;

    @NotBlank(message = "Email-ul este obligatoriu")
    @Email(message = "Formatul email-ului nu este valid")
    private String email;

    @NotBlank(message = "Parola este obligatorie")
    @Size(min = 6, message = "Parola trebuie să aibă minim 6 caractere")
    private String password;

    public UserDTO() {}

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}