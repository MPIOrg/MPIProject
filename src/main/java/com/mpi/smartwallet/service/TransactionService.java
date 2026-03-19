package com.mpi.smartwallet.service;

import com.mpi.smartwallet.entity.Transaction;
import com.mpi.smartwallet.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public List<Transaction> getTransactionsByUserId(Integer userId) {
        return transactionRepository.findByUserId(userId);
    }

    public Transaction addTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    // Funcție custom: Calculează câți bani mai are user-ul
    public BigDecimal calculateUserBalance(Integer userId) {
        List<Transaction> userTransactions = getTransactionsByUserId(userId);
        BigDecimal balance = BigDecimal.ZERO;

        for (Transaction t : userTransactions) {
            if ("INCOME".equalsIgnoreCase(t.getCategory().getType())) {
                balance = balance.add(t.getAmount());
            } else if ("EXPENSE".equalsIgnoreCase(t.getCategory().getType())) {
                balance = balance.subtract(t.getAmount());
            }
        }
        return balance;
    }
}