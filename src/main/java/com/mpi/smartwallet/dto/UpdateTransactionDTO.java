package com.mpi.smartwallet.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public class UpdateTransactionDTO {

    @NotNull(message = "Suma este obligatorie")
    @Positive(message = "Suma trebuie să fie strict pozitivă")
    private BigDecimal amount;

    public UpdateTransactionDTO() {}

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
