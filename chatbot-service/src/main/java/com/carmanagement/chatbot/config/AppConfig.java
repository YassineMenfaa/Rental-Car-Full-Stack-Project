package com.carmanagement.chatbot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Application configuration for REST clients and other beans.
 */
@Configuration
public class AppConfig {

    /**
     * RestTemplate bean for making HTTP calls to other services.
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
