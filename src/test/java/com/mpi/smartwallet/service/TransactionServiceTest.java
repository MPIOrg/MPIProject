package com.mpi.smartwallet.service;

import com.mpi.smartwallet.dto.TransactionDTO;
import com.mpi.smartwallet.entity.User;
import com.mpi.smartwallet.entity.Category;
import com.mpi.smartwallet.entity.Transaction;
import com.mpi.smartwallet.repository.TransactionRepository;
import com.mpi.smartwallet.repository.UserRepository;
import com.mpi.smartwallet.repository.CategoryRepository;
import com.mpi.smartwallet.exception.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private TransactionService transactionService;

    @Test
    void testCreateTransaction_Success() {
        // 1. ARRANGE - Pregătim datele (Scenario: Happy Path) [cite: 75, 761]
        TransactionDTO dto = new TransactionDTO();
        dto.setAmount(new BigDecimal("100.00"));
        dto.setUserId(1);
        dto.setCategoryId(1);
        dto.setTransactionDate(LocalDate.now());

        User mockUser = new User();
        mockUser.setId(1);

        Category mockCategory = new Category();
        mockCategory.setId(1);

        Transaction savedTx = new Transaction();
        savedTx.setId(100);
        savedTx.setAmount(new BigDecimal("100.00"));

        // Configurăm Mock-urile să returneze valorile dorite [cite: 727, 762]
        when(userRepository.findById(1)).thenReturn(Optional.of(mockUser));
        when(categoryRepository.findById(1)).thenReturn(Optional.of(mockCategory));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(savedTx);

        // 2. ACT - Executăm metoda reală [cite: 786]
        Transaction result = transactionService.addTransaction(dto);

        // 3. ASSERT - Verificăm rezultatul și comportamentul [cite: 781, 788]
        assertNotNull(result);
        assertEquals(new BigDecimal("100.00"), result.getAmount());
        // Verificăm că repository-ul a fost apelat pentru salvare [cite: 734, 790]
        verify(transactionRepository, times(1)).save(any(Transaction.class));
    }

    @Test
    void testCreateTransaction_UserNotFound_ThrowsException() {
        // 1. ARRANGE - Simulăm un scenariu de eroare [cite: 793, 794]
        TransactionDTO dto = new TransactionDTO();
        dto.setUserId(999);
        dto.setAmount(new BigDecimal("50.0"));
        dto.setTransactionDate(LocalDate.now());

        // Simulăm că utilizatorul nu este găsit în DB
        when(userRepository.findById(999)).thenReturn(Optional.empty());

        // 2. ACT & 3. ASSERT - Verificăm dacă aruncă excepția corectă [cite: 877]
        assertThrows(ResourceNotFoundException.class, () -> {
            transactionService.addTransaction(dto);
        });
    }
}