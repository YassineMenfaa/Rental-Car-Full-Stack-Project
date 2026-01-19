package com.carmanagement.rental.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@FeignClient(name = "car-service", url = "${car.service.url:http://localhost:8082}")
public interface CarServiceClient {

        @GetMapping("/api/cars/{id}")
        CarResponse getCarById(@PathVariable("id") Long id);

        @GetMapping("/api/cars/{id}/available")
        Boolean isCarAvailable(@PathVariable("id") Long id);

        @PostMapping("/api/cars/{id}/availability")
        CarResponse updateCarAvailability(
                        @PathVariable("id") Long id,
                        @RequestParam("available") boolean available);

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        class CarResponse {
                private Long id;
                private String brand;
                private String model;
                private Integer year;
                private String owner;
                private Double pricePerDay;
                private Boolean available;
                private Integer rentalCount;
                private String imageUrl;
                private String description;
        }
}
