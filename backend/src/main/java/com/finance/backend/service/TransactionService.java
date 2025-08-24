package com.finance.backend.service;

import com.finance.backend.model.Transaction;
import com.finance.backend.model.User;
import com.finance.backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactionsByUser(User user) {
        return transactionRepository.findByUser(user);
    }

    public boolean deleteTransactionById(Long id) {
        if (transactionRepository.existsById(id)) {
            transactionRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean updateTransactionById(Long id, Transaction updatedTransaction) {
        return transactionRepository.findById(id).map(existing -> {
            existing.setAmount(updatedTransaction.getAmount());
            existing.setCategory(updatedTransaction.getCategory());
            existing.setNote(updatedTransaction.getNote());
            existing.setType(updatedTransaction.getType());
            existing.setDate(updatedTransaction.getDate());
            transactionRepository.save(existing);
            return true;
        }).orElse(false);
    }
}
