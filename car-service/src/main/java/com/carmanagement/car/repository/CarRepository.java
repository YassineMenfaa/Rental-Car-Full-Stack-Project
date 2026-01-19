package com.carmanagement.car.repository;

import com.carmanagement.car.model.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {

    List<Car> findByAvailableTrue();

    List<Car> findByBrandContainingIgnoreCase(String brand);

    List<Car> findByModelContainingIgnoreCase(String model);

    List<Car> findByYear(Integer year);

    @Query("SELECT c FROM Car c WHERE " +
            "(:brand IS NULL OR LOWER(c.brand) LIKE LOWER(CONCAT('%', :brand, '%'))) AND " +
            "(:model IS NULL OR LOWER(c.model) LIKE LOWER(CONCAT('%', :model, '%'))) AND " +
            "(:year IS NULL OR c.year = :year) AND " +
            "(:available IS NULL OR c.available = :available)")
    List<Car> searchCars(
            @Param("brand") String brand,
            @Param("model") String model,
            @Param("year") Integer year,
            @Param("available") Boolean available);

    @Query("SELECT c FROM Car c WHERE c.available = true ORDER BY c.rentalCount DESC, c.year DESC")
    List<Car> findRecommendedCars();
}
