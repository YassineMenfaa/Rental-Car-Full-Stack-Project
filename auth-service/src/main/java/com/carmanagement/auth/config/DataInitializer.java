package com.carmanagement.auth.config;

import com.carmanagement.auth.model.User;
import com.carmanagement.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("admin@neorent.com")) {
            User admin = new User();
            admin.setEmail("admin@neorent.com");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("✅ DEFAULT ADMIN CREATED: email=admin@neorent.com, password=admin");
        } else {
            System.out.println("ℹ️ Admin user already exists.");
        }
    }
}
