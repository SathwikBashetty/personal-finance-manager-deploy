package com.finance.backend.service;

import com.finance.backend.model.Transaction;
import com.finance.backend.model.User;
import com.finance.backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
public class AIService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Value("${gemini.api.key}")
    private String geminiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=";

    public String generateSpendingInsights(User user) {
        List<Transaction> transactions = transactionRepository.findByUser(user);

        if (transactions.isEmpty()) {
            return "No transactions found yet. Add some data to let the AI analyze your spending!";
        }

        // Aggregate Data for Prompt
        double totalBalance = transactions.stream().mapToDouble(t -> "income".equalsIgnoreCase(t.getType()) ? t.getAmount() : -t.getAmount()).sum();
        Map<String, Double> categorySpending = transactions.stream()
                .filter(t -> "expense".equalsIgnoreCase(t.getType()))
                .collect(Collectors.groupingBy(Transaction::getCategory, Collectors.summingDouble(Transaction::getAmount)));

        String topCategory = categorySpending.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey).orElse("None");

        // Construct AI Prompt
        String prompt = String.format(
            "Analyze these personal finance records and give me 3-4 short, personal, actionable tips for the user in 100 words or less. These spending are in rupees . After reviewing give the result in rupees only " +
            "Direct the advice specifically to this person. " +
            "Current Balance: %.2f. Top Expense Category: %s (%.2f). Total Category Breakdown: %s.",
            totalBalance, topCategory, categorySpending.getOrDefault(topCategory, 0.0), categorySpending.toString()
        );

        return callGemini(prompt);
    }

    private String callGemini(String promptText) {
        // Log key (masked for safety) to verify loading
        String maskedKey = (geminiKey != null && geminiKey.length() > 6) ? geminiKey.substring(0, 4) + "****" : "missing";
        System.out.println("DEBUG: Calling Gemini API with key: " + maskedKey);

        String[] models = {"gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest", "gemini-pro-latest"};
        String lastError = "";

        for (String modelName : models) {
            try {
                RestTemplate restTemplate = new RestTemplate();
                String url = "https://generativelanguage.googleapis.com/v1/models/" + modelName + ":generateContent?key=" + geminiKey;

                org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
                headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);

                Map<String, String> partMap = new HashMap<>();
                partMap.put("text", promptText);
                Map<String, Object> contentMap = new HashMap<>();
                contentMap.put("parts", java.util.Collections.singletonList(partMap));
                Map<String, Object> requestBody = new HashMap<>();
                requestBody.put("contents", java.util.Collections.singletonList(contentMap));

                org.springframework.http.HttpEntity<Map<String, Object>> entity = new org.springframework.http.HttpEntity<>(requestBody, headers);
                Map<String, Object> response = restTemplate.postForObject(url, entity, Map.class);

                if (response != null && response.containsKey("candidates")) {
                    java.util.List<Map<String, Object>> candidates = (java.util.List<Map<String, Object>>) response.get("candidates");
                    if (!candidates.isEmpty()) {
                        Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                        java.util.List<Map<String, String>> partsResp = (java.util.List<Map<String, String>>) content.get("parts");
                        if (partsResp != null && !partsResp.isEmpty()) {
                            return partsResp.get(0).get("text");
                        }
                    }
                }
            } catch (org.springframework.web.client.HttpStatusCodeException e) {
                lastError = e.getStatusCode() + " (" + modelName + ")";
                System.err.println("Gemini Error (" + modelName + "): " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
                if (e.getStatusCode().value() != 404) break; // If not 404, stop trying
            } catch (Exception e) {
                lastError = e.getMessage();
                System.err.println("Gemini General Error: " + e.getMessage());
                break;
            }
        }
        return "AI advisor is deep in thought. Last error: " + lastError;
    }
}

