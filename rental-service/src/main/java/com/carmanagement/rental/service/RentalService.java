package com.carmanagement.rental.service;

import com.carmanagement.rental.client.CarServiceClient;
import com.carmanagement.rental.dto.RentalDTO;
import com.carmanagement.rental.model.Rental;
import com.carmanagement.rental.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RentalService {

    private final RentalRepository rentalRepository;
    private final CarServiceClient carServiceClient;

    private static final double LATE_PENALTY_PER_DAY = 20.0;

    @Transactional
    public Rental createRental(Long userId, String username, RentalDTO.CreateRequest request) {
        // Check if car exists and is available
        CarServiceClient.CarResponse car = carServiceClient.getCarById(request.getCarId());
        if (car == null) {
            throw new IllegalArgumentException("Car not found with ID: " + request.getCarId());
        }
        if (!car.getAvailable()) {
            throw new IllegalStateException("Car is not available for rental");
        }

        // Check for conflicting rentals
        List<Rental> conflicts = rentalRepository.findConflictingRentals(
                request.getCarId(),
                request.getStartDate(),
                request.getEndDate());
        if (!conflicts.isEmpty()) {
            throw new IllegalStateException("Car is already booked for the selected dates");
        }

        // Calculate total price
        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        double totalPrice = days * car.getPricePerDay();

        // Create rental
        Rental rental = Rental.builder()
                .carId(request.getCarId())
                .userId(userId)
                .username(username)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .pricePerDay(car.getPricePerDay())
                .totalPrice(totalPrice)
                .status(Rental.RentalStatus.ACTIVE)
                .build();

        Rental savedRental = rentalRepository.save(rental);

        // Update car availability
        carServiceClient.updateCarAvailability(request.getCarId(), false);

        log.info("Created rental {} for user {} on car {}", savedRental.getId(), username, request.getCarId());
        return savedRental;
    }

    @Transactional
    public List<Rental> createMultiCarRental(Long userId, String username, RentalDTO.MultiCarRequest request) {
        List<Rental> rentals = new ArrayList<>();

        for (Long carId : request.getCarIds()) {
            RentalDTO.CreateRequest singleRequest = RentalDTO.CreateRequest.builder()
                    .carId(carId)
                    .startDate(request.getStartDate())
                    .endDate(request.getEndDate())
                    .build();

            try {
                Rental rental = createRental(userId, username, singleRequest);
                rentals.add(rental);
            } catch (Exception e) {
                // Rollback any successful rentals
                for (Rental r : rentals) {
                    carServiceClient.updateCarAvailability(r.getCarId(), true);
                    r.setStatus(Rental.RentalStatus.CANCELLED);
                    rentalRepository.save(r);
                }
                throw new IllegalStateException("Failed to rent car " + carId + ": " + e.getMessage());
            }
        }

        return rentals;
    }

    @Transactional
    public Rental returnCar(Long rentalId) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new IllegalArgumentException("Rental not found"));

        if (rental.getStatus() != Rental.RentalStatus.ACTIVE) {
            throw new IllegalStateException("Rental is not active");
        }

        LocalDate today = LocalDate.now();
        rental.setReturnDate(today);

        // Calculate late penalty if applicable
        if (today.isAfter(rental.getEndDate())) {
            long lateDays = ChronoUnit.DAYS.between(rental.getEndDate(), today);
            rental.setLatePenalty(lateDays * LATE_PENALTY_PER_DAY);
            log.info("Rental {} returned {} days late, penalty: {}", rentalId, lateDays, rental.getLatePenalty());
        } else {
            rental.setLatePenalty(0.0);
        }

        rental.setStatus(Rental.RentalStatus.COMPLETED);

        // Update car availability
        carServiceClient.updateCarAvailability(rental.getCarId(), true);

        return rentalRepository.save(rental);
    }

    @Transactional
    public Rental cancelRental(Long rentalId) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new IllegalArgumentException("Rental not found"));

        if (rental.getStatus() != Rental.RentalStatus.ACTIVE) {
            throw new IllegalStateException("Rental is not active");
        }

        rental.setStatus(Rental.RentalStatus.CANCELLED);

        // Update car availability
        carServiceClient.updateCarAvailability(rental.getCarId(), true);

        return rentalRepository.save(rental);
    }

    public List<Rental> getUserRentals(Long userId) {
        return rentalRepository.findByUserId(userId);
    }

    public List<Rental> getUserActiveRentals(Long userId) {
        return rentalRepository.findByUserIdAndStatus(userId, Rental.RentalStatus.ACTIVE);
    }

    public List<Rental> getAllRentals() {
        return rentalRepository.findAllOrderByCreatedAtDesc();
    }

    public Optional<Rental> getRentalById(Long id) {
        return rentalRepository.findById(id);
    }

    public RentalDTO.Response toResponse(Rental rental) {
        RentalDTO.CarInfo carInfo = null;
        try {
            CarServiceClient.CarResponse car = carServiceClient.getCarById(rental.getCarId());
            if (car != null) {
                carInfo = RentalDTO.CarInfo.builder()
                        .id(car.getId())
                        .brand(car.getBrand())
                        .model(car.getModel())
                        .year(car.getYear())
                        .pricePerDay(car.getPricePerDay())
                        .imageUrl(car.getImageUrl())
                        .build();
            }
        } catch (Exception e) {
            log.warn("Could not fetch car info for rental {}: {}", rental.getId(), e.getMessage());
        }

        return RentalDTO.Response.builder()
                .id(rental.getId())
                .carId(rental.getCarId())
                .car(carInfo)
                .userId(rental.getUserId())
                .username(rental.getUsername())
                .startDate(rental.getStartDate())
                .endDate(rental.getEndDate())
                .returnDate(rental.getReturnDate())
                .pricePerDay(rental.getPricePerDay())
                .totalPrice(rental.getTotalPrice())
                .latePenalty(rental.getLatePenalty())
                .status(rental.getStatus().name())
                .build();
    }
}
