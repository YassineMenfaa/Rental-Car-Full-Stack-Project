package com.carmanagement.car.controller;

import com.carmanagement.car.model.Car;
import com.carmanagement.car.service.CarService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
public class CarController {
    private final CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    // Public: list all cars
    @GetMapping
    public ResponseEntity<List<Car>> list() {
        return ResponseEntity.ok(carService.list());
    }

    // Public: get by id
    @GetMapping("/{id}")
    public ResponseEntity<Car> get(@PathVariable Long id) {
        Car car = carService.get(id);
        if (car == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(car);
    }

    // Protected: create (requires Bearer token)
    @PostMapping
    public ResponseEntity<Car> create(@RequestBody Car car, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(carService.create(car));
    }

    // Protected: update (requires Bearer token)
    @PutMapping("/{id}")
    public ResponseEntity<Car> update(@PathVariable Long id, @RequestBody Car car, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        Car updated = carService.update(id, car);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    // Protected: delete (requires Bearer token)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        boolean ok = carService.delete(id);
        if (!ok) return ResponseEntity.notFound().build();
        return ResponseEntity.noContent().build();
    }
}
