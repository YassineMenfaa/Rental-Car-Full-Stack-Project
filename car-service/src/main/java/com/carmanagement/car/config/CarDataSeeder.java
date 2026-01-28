package com.carmanagement.car.config;

import com.carmanagement.car.model.Car;
import com.carmanagement.car.repository.CarRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;

@Component
public class CarDataSeeder implements CommandLineRunner {

    private final CarRepository carRepository;
    private final ObjectMapper objectMapper;

    public CarDataSeeder(CarRepository carRepository, ObjectMapper objectMapper) {
        this.carRepository = carRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) throws Exception {
        // Kanchofo wach database khawya bach man3awdoch n-chargiw data kola mara
        if (carRepository.count() == 0) {
            try {
                // Kan-9raw l fichier cars.json mn resources
                InputStream inputStream = TypeReference.class.getResourceAsStream("/cars.json");

                // Kan-7ewlo JSON l List dyal Car objects
                List<Car> cars = objectMapper.readValue(inputStream, new TypeReference<List<Car>>(){});

                // Kan-sauvegardiw f database
                carRepository.saveAll(cars);

                System.out.println("✅ Data Seeding Completed: " + cars.size() + " cars added to the database.");
            } catch (Exception e) {
                System.out.println("❌ Error loading data: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("ℹ️ Database already contains data. Skipping seeding.");
        }
    }
}