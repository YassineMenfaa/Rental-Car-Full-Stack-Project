package com.carmanagement.chatbot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * ==========================================
 * CHATBOT SERVICE - MAIN APPLICATION
 * ==========================================
 * 
 * This is the entry point for the Chatbot microservice.
 * 
 * Key annotations:
 * - @SpringBootApplication: Enables Spring Boot auto-configuration
 * - @EnableDiscoveryClient: Registers this service with Eureka
 * - @EnableScheduling: Enables scheduled tasks (for car cache refresh)
 * 
 * When this application starts, Spring Boot will:
 * 1. Scan for components in this package and sub-packages
 * 2. Auto-configure Spring AI with Ollama (thanks to the starter dependency)
 * 3. Register with Eureka for service discovery
 * 4. Start the web server on port 8084
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableScheduling
public class ChatbotServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChatbotServiceApplication.class, args);
    }
}
