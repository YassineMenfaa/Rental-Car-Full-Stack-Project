package com.carmanagement.auth.controller;

import com.carmanagement.auth.dto.LoginRequest;
import com.carmanagement.auth.dto.RegisterRequest;
import com.carmanagement.auth.model.User;
import com.carmanagement.auth.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest req) {
        return userService.register(req.getEmail(), req.getPassword());
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest req) {
        try {
            String token = userService.login(req.getEmail(), req.getPassword());
            return ResponseEntity.ok(token);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage()); // "User not found" ou "Invalid credentials"
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> users() {
        return ResponseEntity.ok(userService.getAll());
    }
}
