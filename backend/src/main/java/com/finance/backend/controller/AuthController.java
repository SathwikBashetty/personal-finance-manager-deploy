package com.finance.backend.controller;

import com.finance.backend.model.User;
import com.finance.backend.service.UserService;
import com.finance.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        if (userService.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists.");
        }
        userService.registerUser(user);
        return ResponseEntity.ok("User registered successfully.");
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User user) {
        Optional<User> existingUser = userService.findByEmail(user.getEmail());

        if (existingUser.isEmpty()) {
            return ResponseEntity.status(401).body("User not found.");
        }

        if (!userService.verifyPassword(user.getPassword(), existingUser.get().getPassword())) {
            return ResponseEntity.status(401).body("Invalid password.");
        }

        // ✅ Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail());

        // ✅ Return token in response
        return ResponseEntity.ok(token);
    }
}
