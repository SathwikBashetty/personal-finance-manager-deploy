package com.finance.backend.controller;

import com.finance.backend.model.User;
import com.finance.backend.service.AIService;
import com.finance.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/insights")
    public Map<String, String> getInsights() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElse(null);

        Map<String, String> response = new HashMap<>();
        if (user == null) {
            response.put("insight", "User not found.");
            return response;
        }

        response.put("insight", aiService.generateSpendingInsights(user));
        return response;
    }
}
