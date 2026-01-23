package com.carmanagement.auth.service;

import java.util.List;
import com.carmanagement.auth.model.User;
import com.carmanagement.auth.repository.UserRepository;
import com.carmanagement.auth.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Injection via constructeur
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Génération du JWT
        return JwtUtil.generateToken(user.getEmail(), user.getRole());
    }

    // Méthode pour enregistrer un utilisateur
    public User register(String email, String password) {
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password)); // hashage du mot de passe
        user.setRole("USER"); // rôle par défaut
        return userRepository.save(user);
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    // Méthode pour chercher un utilisateur par email
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
}
