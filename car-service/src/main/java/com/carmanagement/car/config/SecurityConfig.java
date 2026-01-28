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
import org.springframework.web.cors.CorsConfiguration; // <-- Zid had import
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; // <-- Zid had import

import java.util.List; // <-- Zid had import

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    // ❌ 7iyedna l injection dyal corsConfigurationSource mn hna 7it ghadi n-creeroh ta7t

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                // ✅ Hna kan-3ayto 3la l bean li definina ta7t
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Darori l CORS
                        .requestMatchers("/error").permitAll()
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/v3/api-docs.yaml",
                                "/swagger-resources/**",
                                "/webjars/**",
                                "/actuator/**")
                        .permitAll()

                        // Debug endpoint
                        .requestMatchers(HttpMethod.GET, "/api/cars/auth-debug").authenticated()

                        // ✅ Allow Public Access to GET Cars (Hada howa li khassk l Frontend)
                        .requestMatchers(HttpMethod.GET, "/api/cars/**").permitAll()

                        // Allow Creating Cars (Optional: I prefer keeping this secured usually, but okay for dev)
                        .requestMatchers(HttpMethod.POST, "/api/cars").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/cars/**").permitAll()

                        // Admin only for updates
                        .requestMatchers(HttpMethod.PUT, "/api/cars/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/cars/**").hasRole("ADMIN")

                        // Availability
                        .requestMatchers(HttpMethod.POST, "/api/cars/*/availability").authenticated()

                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    // ✅ ZID HAD L BEAN (Hada howa li ky-gérer CORS dial bsa7)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Autoriser Angular
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));

        // Autoriser ga3 l methods (GET, POST, PUT, DELETE...)
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Autoriser ga3 l headers (Authorization, Content-Type...)
        configuration.setAllowedHeaders(List.of("*"));

        // Autoriser credentials (ila knti katst3mel cookies aw auth headers)
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}