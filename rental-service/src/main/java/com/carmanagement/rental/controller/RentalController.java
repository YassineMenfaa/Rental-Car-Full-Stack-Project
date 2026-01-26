package com.carmanagement.rental.controller;

import com.carmanagement.rental.dto.RentalDTO;
import com.carmanagement.rental.model.Rental;
import com.carmanagement.rental.service.RentalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
@Tag(name = "Rentals", description = "Car rental management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class RentalController {

    private final RentalService rentalService;

    @PostMapping
    @Operation(summary = "Rent a car")
    public ResponseEntity<?> createRental(
            @Valid @RequestBody RentalDTO.CreateRequest request,
            Authentication authentication) {
        try {
            // Extract user info from JWT
            Long userId = extractUserId(authentication);
            String username = authentication.getName();

            Rental rental = rentalService.createRental(userId, username, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(rentalService.toResponse(rental));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @PostMapping("/multi")
    @Operation(summary = "Rent multiple cars in a single transaction")
    public ResponseEntity<?> createMultiCarRental(
            @Valid @RequestBody RentalDTO.MultiCarRequest request,
            Authentication authentication) {
        try {
            Long userId = extractUserId(authentication);
            String username = authentication.getName();

            List<Rental> rentals = rentalService.createMultiCarRental(userId, username, request);
            List<RentalDTO.Response> responses = rentals.stream()
                    .map(rentalService::toResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.status(HttpStatus.CREATED).body(responses);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @PostMapping("/{id}/return")
    @Operation(summary = "Return a rented car")
    public ResponseEntity<?> returnCar(@PathVariable Long id, Authentication authentication) {
        try {
            Rental rental = rentalService.returnCar(id);
            return ResponseEntity.ok(rentalService.toResponse(rental));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel a rental")
    public ResponseEntity<?> cancelRental(@PathVariable Long id, Authentication authentication) {
        try {
            Rental rental = rentalService.cancelRental(id);
            return ResponseEntity.ok(rentalService.toResponse(rental));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @GetMapping("/my")
    @Operation(summary = "Get my rentals")
    public ResponseEntity<List<RentalDTO.Response>> getMyRentals(Authentication authentication) {
        Long userId = extractUserId(authentication);
        List<RentalDTO.Response> rentals = rentalService.getUserRentals(userId).stream()
                .map(rentalService::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(rentals);
    }

    @GetMapping("/my/active")
    @Operation(summary = "Get my active rentals")
    public ResponseEntity<List<RentalDTO.Response>> getMyActiveRentals(Authentication authentication) {
        Long userId = extractUserId(authentication);
        List<RentalDTO.Response> rentals = rentalService.getUserActiveRentals(userId).stream()
                .map(rentalService::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(rentals);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get rental by ID")
    public ResponseEntity<RentalDTO.Response> getRentalById(@PathVariable Long id) {
        return rentalService.getRentalById(id)
                .map(rental -> ResponseEntity.ok(rentalService.toResponse(rental)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all rentals (Admin only)")
    public ResponseEntity<List<RentalDTO.Response>> getAllRentals() {
        List<RentalDTO.Response> rentals = rentalService.getAllRentals().stream()
                .map(rentalService::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(rentals);
    }

    private Long extractUserId(Authentication authentication) {
        // In a real scenario, you'd extract the user ID from the JWT claims
        // For now, we'll use a simple hash of the username
        return (long) authentication.getName().hashCode();
    }
}
