package com.mpi.smartwallet.dto;

import jakarta.validation.constraints.NotBlank;

public class CategoryDTO {

    @NotBlank(message = "Numele categoriei este obligatoriu")
    private String name;

    @NotBlank(message = "Tipul categoriei (INCOME/EXPENSE) este obligatoriu")
    private String type;

    public CategoryDTO() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}