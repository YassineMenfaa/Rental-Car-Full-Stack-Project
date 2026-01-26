package com.carmanagement.car.service;

import com.carmanagement.car.model.Car;
import com.carmanagement.car.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CarService {

    private final CarRepository carRepository;

    public List<Car> list() {
        return carRepository.findAll();
    }

    public List<Car> listAvailable() {
        return carRepository.findByAvailableTrue();
    }

    public Optional<Car> get(Long id) {
        return carRepository.findById(id);
    }

    @Transactional
    public Car create(Car car) {
        car.setAvailable(true);
        car.setRentalCount(0);
        return carRepository.save(car);
    }

    @Transactional
    public Optional<Car> update(Long id, Car carDetails) {
        return carRepository.findById(id)
                .map(existing -> {
                    existing.setBrand(carDetails.getBrand());
                    existing.setModel(carDetails.getModel());
                    existing.setYear(carDetails.getYear());
                    existing.setOwner(carDetails.getOwner());
                    existing.setPricePerDay(carDetails.getPricePerDay());
                    existing.setImageUrl(carDetails.getImageUrl());
                    existing.setDescription(carDetails.getDescription());
                    existing.setFuelType(carDetails.getFuelType());
                    existing.setTransmission(carDetails.getTransmission());
                    existing.setCategory(carDetails.getCategory());
                    existing.setSeats(carDetails.getSeats());
                    return carRepository.save(existing);
                });
    }

    @Transactional
    public boolean delete(Long id) {
        return carRepository.findById(id)
                .map(car -> {
                    if (!car.getAvailable()) {
                        throw new IllegalStateException("Cannot delete a car that is currently rented");
                    }
                    carRepository.delete(car);
                    return true;
                })
                .orElse(false);
    }

    public List<Car> search(String brand, String model, Integer year, Boolean available) {
        return carRepository.searchCars(brand, model, year, available);
    }

    public List<Car> getRecommendations() {
        return carRepository.findRecommendedCars();
    }

    @Transactional
    public Optional<Car> setAvailability(Long id, boolean available) {
        return carRepository.findById(id)
                .map(car -> {
                    car.setAvailable(available);
                    if (!available) {
                        car.setRentalCount(car.getRentalCount() + 1);
                    }
                    return carRepository.save(car);
                });
    }

    public boolean isAvailable(Long id) {
        return carRepository.findById(id)
                .map(Car::getAvailable)
                .orElse(false);
    }
}
