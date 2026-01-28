package com.carmanagement.car.controller;

import com.carmanagement.car.model.Car;
import com.carmanagement.car.service.CarService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@Tag(name = "Cars", description = "Car management endpoints")
public class CarController {

    private final CarService carService;

    @GetMapping
    @Operation(summary = "Get all cars")
    public ResponseEntity<List<Car>> getAllCars() {
        return ResponseEntity.ok(carService.list());
    }

    @GetMapping("/available")
    @Operation(summary = "Get all available cars")
    public ResponseEntity<List<Car>> getAvailableCars() {
        return ResponseEntity.ok(carService.listAvailable());
    }

    @GetMapping("/search")
    @Operation(summary = "Search cars by brand, model, year, or availability")
    public ResponseEntity<List<Car>> searchCars(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Boolean available) {
        return ResponseEntity.ok(carService.search(brand, model, year, available));
    }

    @GetMapping("/recommendations")
    @Operation(summary = "Get recommended cars based on popularity and age")
    public ResponseEntity<List<Car>> getRecommendations() {
        return ResponseEntity.ok(carService.getRecommendations());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get car by ID")
    public ResponseEntity<Car> getCarById(@PathVariable Long id) {
        System.out.println("DEBUG: Fetching car with ID: " + id);
        return carService.get(id)
                .map(car -> {
                    System.out.println("DEBUG: Found car: " + car.getBrand() + " " + car.getModel());
                    return ResponseEntity.ok(car);
                })
                .orElseGet(() -> {
                    System.out.println("DEBUG: Car NOT FOUND with ID: " + id);
                    return ResponseEntity.notFound().build();
                });
    }

    @GetMapping("/{id}/available")
    @Operation(summary = "Check if car is available")
    public ResponseEntity<Boolean> checkAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(carService.isAvailable(id));
    }

    @PostMapping
    @Operation(summary = "Create a new car", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Car> createCar(@RequestBody Car car) {
        System.out.println("DEBUG: Entering createCar with " + car);
        Car created = carService.create(car);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update car details", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Car> updateCar(@PathVariable Long id, @RequestBody Car car) {
        return carService.update(id, car)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a car (only if not rented)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        try {
            boolean deleted = carService.delete(id);
            return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @PostMapping("/{id}/availability")
    @Operation(summary = "Update car availability (internal use)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Car> updateAvailability(
            @PathVariable Long id,
            @RequestParam boolean available) {
        return carService.setAvailability(id, available)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/auth-debug")
    public ResponseEntity<String> getAuthDebug() {
        return ResponseEntity.ok(org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getAuthorities().toString());
    }
}
