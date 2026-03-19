package com.mpi.smartwallet.service;

import com.mpi.smartwallet.dto.TransactionDTO;
import com.mpi.smartwallet.entity.Category;
import com.mpi.smartwallet.entity.Transaction;
import com.mpi.smartwallet.entity.User;
import com.mpi.smartwallet.exception.ResourceNotFoundException;
import com.mpi.smartwallet.repository.CategoryRepository;
import com.mpi.smartwallet.repository.TransactionRepository;
import com.mpi.smartwallet.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository, CategoryRepository categoryRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Transaction> getTransactionsByUserId(Integer userId) {
        return transactionRepository.findByUserId(userId);
    }

    // Transformăm TransactionDTO în Transaction și verificăm dacă User/Category există
    public Transaction addTransaction(TransactionDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User-ul nu a fost găsit!"));
                
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria nu a fost găsită!"));

        Transaction transaction = new Transaction();
        transaction.setAmount(dto.getAmount());
        transaction.setDescription(dto.getDescription());
        transaction.setTransactionDate(dto.getTransactionDate());
        transaction.setUser(user);
        transaction.setCategory(category);

        return transactionRepository.save(transaction);
    }

    public Map<String, BigDecimal> getMonthlyReport(Integer userId, int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        List<Transaction> monthlyTransactions = transactionRepository
                .findByUserIdAndTransactionDateBetween(userId, startDate, endDate);

        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;

        for (Transaction t : monthlyTransactions) {
            if ("INCOME".equalsIgnoreCase(t.getCategory().getType())) {
                totalIncome = totalIncome.add(t.getAmount());
            } else if ("EXPENSE".equalsIgnoreCase(t.getCategory().getType())) {
                totalExpense = totalExpense.add(t.getAmount());
            }
        }

        Map<String, BigDecimal> report = new HashMap<>();
        report.put("totalIncome", totalIncome);
        report.put("totalExpense", totalExpense);
        report.put("netSavings", totalIncome.subtract(totalExpense));

        return report;
    }
}