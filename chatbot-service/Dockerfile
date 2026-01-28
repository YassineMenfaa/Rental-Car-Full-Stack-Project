# ==========================================
# DOCKER BUILD FILE FOR CHATBOT SERVICE
# ==========================================
# 
# Multi-stage build for optimal image size:
# 1. Build stage: Compiles the Java application
# 2. Runtime stage: Runs the compiled JAR

# ==========================================
# STAGE 1: BUILD
# ==========================================
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml first for dependency caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# ==========================================
# STAGE 2: RUNTIME
# ==========================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port 8084
EXPOSE 8084

# Run the application with Docker profile
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=docker", "app.jar"]
