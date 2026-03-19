package com.mpi.smartwallet.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;

public class TransactionDTO {

    @NotNull(message = "Suma este obligatorie")
    @Positive(message = "Suma trebuie să fie strict pozitivă")
    private BigDecimal amount;

    private String description;

    @NotNull(message = "Data tranzacției este obligatorie")
    private LocalDate transactionDate;

    @NotNull(message = "ID-ul utilizatorului este obligatoriu")
    private Integer userId;

    @NotNull(message = "ID-ul categoriei este obligatoriu")
    private Integer categoryId;

    public TransactionDTO() {}

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDate transactionDate) { this.transactionDate = transactionDate; }
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }
}