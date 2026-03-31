package com.finance.backend.repository;

import com.finance.backend.model.Goal;
import com.finance.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByUser(User user);
}
