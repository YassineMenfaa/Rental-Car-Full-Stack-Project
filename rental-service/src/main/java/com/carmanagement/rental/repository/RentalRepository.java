package com.carmanagement.rental.repository;

import com.carmanagement.rental.model.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface RentalRepository extends JpaRepository<Rental, Long> {

    List<Rental> findByUserId(Long userId);

    List<Rental> findByCarId(Long carId);

    List<Rental> findByStatus(Rental.RentalStatus status);

    List<Rental> findByUserIdAndStatus(Long userId, Rental.RentalStatus status);

    @Query("SELECT r FROM Rental r WHERE r.carId = :carId AND r.status = 'ACTIVE' " +
            "AND ((r.startDate <= :endDate AND r.endDate >= :startDate))")
    List<Rental> findConflictingRentals(
            @Param("carId") Long carId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT r FROM Rental r WHERE r.carId = :carId AND r.status = 'ACTIVE'")
    List<Rental> findActiveRentalsByCarId(@Param("carId") Long carId);

    @Query("SELECT r FROM Rental r ORDER BY r.createdAt DESC")
    List<Rental> findAllOrderByCreatedAtDesc();
}
