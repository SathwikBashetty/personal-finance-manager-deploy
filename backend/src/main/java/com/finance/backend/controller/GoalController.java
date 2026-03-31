package com.finance.backend.controller;

import com.finance.backend.model.Goal;
import com.finance.backend.model.User;
import com.finance.backend.repository.GoalRepository;
import com.finance.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email).orElse(null);
    }

    @GetMapping
    public List<Goal> getGoals() {
        return goalRepository.findByUser(getAuthenticatedUser());
    }

    @PostMapping("/add")
    public Goal addGoal(@RequestBody Goal goal) {
        goal.setUser(getAuthenticatedUser());
        if (goal.getCurrentAmount() == null) goal.setCurrentAmount(0.0);
        return goalRepository.save(goal);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Goal> updateGoal(@PathVariable Long id, @RequestBody Goal goalDetails) {
        Goal goal = goalRepository.findById(id).orElse(null);
        if (goal == null) return ResponseEntity.notFound().build();

        // Security check
        if (!goal.getUser().getId().equals(getAuthenticatedUser().getId())) {
            return ResponseEntity.status(403).build();
        }

        goal.setTitle(goalDetails.getTitle());
        goal.setTargetAmount(goalDetails.getTargetAmount());
        goal.setCurrentAmount(goalDetails.getCurrentAmount());
        goal.setDeadline(goalDetails.getDeadline());

        return ResponseEntity.ok(goalRepository.save(goal));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        Goal goal = goalRepository.findById(id).orElse(null);
        if (goal == null) return ResponseEntity.notFound().build();

        // Security check
        if (!goal.getUser().getId().equals(getAuthenticatedUser().getId())) {
            return ResponseEntity.status(403).build();
        }

        goalRepository.delete(goal);
        return ResponseEntity.noContent().build();
    }
}
