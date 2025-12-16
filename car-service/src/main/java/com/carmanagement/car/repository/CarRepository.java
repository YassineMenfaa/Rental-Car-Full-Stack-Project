package com.carmanagement.car.repository;

import com.carmanagement.car.model.Car;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarRepository extends JpaRepository<Car, Long> {
}
