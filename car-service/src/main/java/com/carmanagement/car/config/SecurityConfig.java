package com.carmanagement.car.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthFilter jwtAuthFilter;
        private final CorsConfigurationSource corsConfigurationSource;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                return http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                                .csrf(csrf -> csrf.disable())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth
                                                // Public endpoints
                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                                .requestMatchers("/error").permitAll()
                                                .requestMatchers(
                                                                "/swagger-ui/**",
                                                                "/v3/api-docs/**",
                                                                "/v3/api-docs.yaml",
                                                                "/swagger-resources/**",
                                                                "/webjars/**",
                                                                "/actuator/**")
                                                .permitAll()
                                                // Debug endpoint - MUST be before public wildcards and authenticated
                                                .requestMatchers(HttpMethod.GET, "/api/cars/auth-debug").authenticated()
                                                .requestMatchers(HttpMethod.POST, "/api/cars").permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/cars/**").permitAll()
                                                // Cars - GET is public
                                                .requestMatchers(HttpMethod.GET, "/api/cars/**").permitAll()
                                                .requestMatchers(HttpMethod.PUT, "/api/cars/**").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.DELETE, "/api/cars/**").hasRole("ADMIN")
                                                // Internal availability update - authenticated
                                                .requestMatchers(HttpMethod.POST, "/api/cars/*/availability")
                                                .authenticated()
                                                .anyRequest().authenticated())
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                                .build();
        }
}
