package com.mpi.smartwallet.controller;

import com.mpi.smartwallet.entity.Transaction;
import com.mpi.smartwallet.service.TransactionService;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

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
    public Transaction addTransaction(@RequestBody Transaction transaction) {
        return transactionService.addTransaction(transaction);
    }

    @GetMapping("/user/{userId}/balance")
    public BigDecimal getUserBalance(@PathVariable Integer userId) {
        return transactionService.calculateUserBalance(userId);
    }
}