package com.finance.backend.controller;

import com.finance.backend.model.Transaction;
import com.finance.backend.model.User;
import com.finance.backend.service.TransactionService;
import com.finance.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private UserService userService;

    // ✅ Add income or expense (user from token)
    @PostMapping("/add")
    public ResponseEntity<String> addTransaction(@RequestBody Transaction transaction) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName(); // extract email from JWT

        User user = userService.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized user");
        }

        transaction.setUser(user);
        transactionService.saveTransaction(transaction);
        return ResponseEntity.ok("Transaction saved successfully");
    }

    // ✅ Get transactions of logged-in user
    @GetMapping("/user")
    public ResponseEntity<List<Transaction>> getUserTransactions() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User user = userService.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        List<Transaction> transactions = transactionService.getTransactionsByUser(user);
        return ResponseEntity.ok(transactions);
    }

    // ✅ DELETE transaction by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTransaction(@PathVariable Long id) {
        boolean deleted = transactionService.deleteTransactionById(id);
        return deleted ? ResponseEntity.ok("Transaction deleted")
                : ResponseEntity.status(404).body("Transaction not found");
    }

    // ✅ UPDATE transaction by ID
    @PutMapping("/{id}")
    public ResponseEntity<String> updateTransaction(@PathVariable Long id,
            @RequestBody Transaction updatedTransaction) {
        boolean updated = transactionService.updateTransactionById(id, updatedTransaction);
        return updated ? ResponseEntity.ok("Transaction updated")
                : ResponseEntity.status(404).body("Transaction not found");
    }
}
