package com.carmanagement.car.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "car_inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    @Column(name = "production_year", nullable = false)
    private Integer year;

    private String owner;

    @Column(nullable = false)
    private Double pricePerDay;

    @Column(nullable = false)
    @Builder.Default
    private Boolean available = true;

    @Builder.Default
    private Integer rentalCount = 0;

    private String imageUrl;

    @Column(length = 1000)
    private String description;
}
