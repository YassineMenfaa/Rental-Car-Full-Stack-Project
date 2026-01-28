package com.carmanagement.chatbot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

/**
 * ==========================================
 * CORS CONFIGURATION
 * ==========================================
 * 
 * Cross-Origin Resource Sharing configuration.
 * 
 * This allows the Angular frontend (running on localhost:4200)
 * to make requests to this backend service.
 * 
 * Without this, browsers would block requests due to
 * Same-Origin Policy security restrictions.
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();

        // Allow requests from these origins
        corsConfiguration.setAllowedOrigins(Arrays.asList(
                "http://localhost:4200", // Angular dev server
                "http://localhost:80", // Docker frontend
                "http://localhost" // Production frontend
        ));

        // Allow all standard HTTP methods
        corsConfiguration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Allow all headers
        corsConfiguration.setAllowedHeaders(List.of("*"));

        // Allow credentials (cookies, auth headers)
        corsConfiguration.setAllowCredentials(true);

        // Cache preflight response for 1 hour
        corsConfiguration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);

        return new CorsFilter(source);
    }
}
