package com.carmanagement.car.service;

import com.carmanagement.car.model.Car;
import com.carmanagement.car.repository.CarRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarService {
    private final CarRepository carRepository;

    public CarService(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    public List<Car> list() {
        return carRepository.findAll();
    }

    public Car get(Long id) {
        return carRepository.findById(id).orElse(null);
    }

    public Car create(Car car) {
        return carRepository.save(car);
    }

    public Car update(Long id, Car car) {
        Car existing = carRepository.findById(id).orElse(null);
        if (existing == null) return null;
        existing.setMake(car.getMake());
        existing.setModel(car.getModel());
        existing.setYear(car.getYear());
        existing.setPrice(car.getPrice());
        return carRepository.save(existing);
    }

    public boolean delete(Long id) {
        if (!carRepository.existsById(id)) return false;
        carRepository.deleteById(id);
        return true;
    }
}
