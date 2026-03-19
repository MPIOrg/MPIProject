package com.mpi.smartwallet.controller;

import com.mpi.smartwallet.dto.TransactionDTO;
import com.mpi.smartwallet.entity.Transaction;
import com.mpi.smartwallet.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping("/user/{userId}")
    public List<Transaction> getUserTransactions(@PathVariable Integer userId) {
        return transactionService.getTransactionsByUserId(userId);
    }

    @PostMapping
    public Transaction addTransaction(@Valid @RequestBody TransactionDTO transactionDTO) {
        return transactionService.addTransaction(transactionDTO);
    }

    @GetMapping("/user/{userId}/report")
    public Map<String, BigDecimal> getMonthlyReport(
            @PathVariable Integer userId,
            @RequestParam int year,
            @RequestParam int month) {
        return transactionService.getMonthlyReport(userId, year, month);
    }
}