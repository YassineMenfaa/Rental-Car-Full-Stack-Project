package com.carmanagement.chatbot.client;

import com.carmanagement.chatbot.dto.CarDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Client service to fetch car inventory from car-service.
 * Caches the car list and refreshes every 5 minutes to avoid constant API
 * calls.
 */
@Service
public class CarServiceClient {

    private static final Logger log = LoggerFactory.getLogger(CarServiceClient.class);

    private final RestTemplate restTemplate;
    private final String carServiceUrl;

    // Cached car list
    private List<CarDto> cachedCars = new ArrayList<>();
    private long lastFetchTime = 0;
    private static final long CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

    public CarServiceClient(
            RestTemplate restTemplate,
            @Value("${car-service.url:http://localhost:8082}") String carServiceUrl) {
        this.restTemplate = restTemplate;
        this.carServiceUrl = carServiceUrl;
    }

    /**
     * Get all available cars (from cache or fresh fetch).
     */
    public List<CarDto> getAvailableCars() {
        refreshCacheIfNeeded();
        return cachedCars.stream()
                .filter(car -> car.getAvailable() != null && car.getAvailable())
                .collect(Collectors.toList());
    }

    /**
     * Get cars within a specific budget (price per day).
     */
    public List<CarDto> getCarsWithinBudget(double maxBudget) {
        return getAvailableCars().stream()
                .filter(car -> car.getPricePerDay() != null && car.getPricePerDay() <= maxBudget)
                .sorted(Comparator.comparing(CarDto::getPricePerDay))
                .collect(Collectors.toList());
    }

    /**
     * Get cars by category (Economy, SUV, Luxury, etc.).
     */
    public List<CarDto> getCarsByCategory(String category) {
        return getAvailableCars().stream()
                .filter(car -> car.getCategory() != null &&
                        car.getCategory().equalsIgnoreCase(category))
                .collect(Collectors.toList());
    }

    /**
     * Get cars grouped by category for the AI prompt.
     */
    public Map<String, List<CarDto>> getCarsGroupedByCategory() {
        return getAvailableCars().stream()
                .filter(car -> car.getCategory() != null)
                .collect(Collectors.groupingBy(CarDto::getCategory));
    }

    /**
     * Get price range info for the AI prompt.
     */
    public String getPriceRangeInfo() {
        List<CarDto> cars = getAvailableCars();
        if (cars.isEmpty()) {
            return "No cars currently available.";
        }

        double minPrice = cars.stream()
                .mapToDouble(CarDto::getPricePerDay)
                .min().orElse(0);
        double maxPrice = cars.stream()
                .mapToDouble(CarDto::getPricePerDay)
                .max().orElse(0);

        return String.format("Prices range from %.0f DH/day to %.0f DH/day", minPrice, maxPrice);
    }

    /**
     * Build a formatted car inventory string for the AI system prompt.
     */
    public String buildInventoryPrompt() {
        Map<String, List<CarDto>> carsByCategory = getCarsGroupedByCategory();

        if (carsByCategory.isEmpty()) {
            return "Currently no cars are available in our inventory.";
        }

        StringBuilder sb = new StringBuilder();
        sb.append("=== AVAILABLE CARS IN OUR INVENTORY ===\n\n");
        sb.append(getPriceRangeInfo()).append("\n\n");

        // Sort categories by average price
        List<String> sortedCategories = Arrays.asList(
                "Economy", "Compact", "Midsize", "SUV", "Luxury", "Sports");

        for (String category : sortedCategories) {
            List<CarDto> cars = carsByCategory.get(category);
            if (cars != null && !cars.isEmpty()) {
                // Calculate price range for this category
                double minPrice = cars.stream().mapToDouble(CarDto::getPricePerDay).min().orElse(0);
                double maxPrice = cars.stream().mapToDouble(CarDto::getPricePerDay).max().orElse(0);

                sb.append(String.format("**%s** (%.0f - %.0f DH/day):\n",
                        category.toUpperCase(), minPrice, maxPrice));

                for (CarDto car : cars) {
                    sb.append("  - ").append(car.toPromptString()).append("\n");
                }
                sb.append("\n");
            }
        }

        return sb.toString();
    }

    /**
     * Refresh the cache if it's stale.
     */
    private void refreshCacheIfNeeded() {
        long now = System.currentTimeMillis();
        if (now - lastFetchTime > CACHE_DURATION_MS || cachedCars.isEmpty()) {
            fetchCarsFromService();
        }
    }

    /**
     * Fetch cars from car-service API.
     */
    private void fetchCarsFromService() {
        try {
            log.info("Fetching cars from car-service at: {}", carServiceUrl);

            List<CarDto> cars = restTemplate.exchange(
                    carServiceUrl + "/api/cars",
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<CarDto>>() {
                    }).getBody();

            if (cars != null) {
                cachedCars = cars;
                lastFetchTime = System.currentTimeMillis();
                log.info("Fetched {} cars from car-service", cars.size());
            }
        } catch (Exception e) {
            log.error("Failed to fetch cars from car-service: {}", e.getMessage());
            // Keep the old cache if fetch fails
        }
    }

    /**
     * Scheduled refresh every 5 minutes.
     */
    @Scheduled(fixedRate = 300000) // 5 minutes
    public void scheduledRefresh() {
        fetchCarsFromService();
    }

    /**
     * Force refresh the cache (useful for testing).
     */
    public void forceRefresh() {
        fetchCarsFromService();
    }
}
