package com.carmanagement.chatbot.dto;

/**
 * DTO representing a car from the car-service.
 * Used to fetch and display available rental cars to the AI.
 */
public class CarDto {
    private Long id;
    private String brand;
    private String model;
    private Integer year;
    private Double pricePerDay;
    private Boolean available;
    private String description;
    private String fuelType;
    private String transmission;
    private String category;
    private Integer seats;

    public CarDto() {
    }

    public CarDto(Long id, String brand, String model, Integer year, Double pricePerDay,
            Boolean available, String description, String fuelType,
            String transmission, String category, Integer seats) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.pricePerDay = pricePerDay;
        this.available = available;
        this.description = description;
        this.fuelType = fuelType;
        this.transmission = transmission;
        this.category = category;
        this.seats = seats;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Double getPricePerDay() {
        return pricePerDay;
    }

    public void setPricePerDay(Double pricePerDay) {
        this.pricePerDay = pricePerDay;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFuelType() {
        return fuelType;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    public String getTransmission() {
        return transmission;
    }

    public void setTransmission(String transmission) {
        this.transmission = transmission;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getSeats() {
        return seats;
    }

    public void setSeats(Integer seats) {
        this.seats = seats;
    }

    /**
     * Returns a formatted string for the AI prompt.
     * Example: "Dacia Logan 2023 - 250 DH/day, Diesel, Manual, 5 seats"
     */
    public String toPromptString() {
        return String.format("%s %s %d - %.0f DH/day, %s, %s, %d seats",
                brand, model, year, pricePerDay, fuelType, transmission, seats);
    }
}
