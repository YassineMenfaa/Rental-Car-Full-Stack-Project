# --- Stage 1: Build the Application ---
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Build the JAR, skipping tests to avoid errors and save time
RUN mvn clean package -Dmaven.test.skip=true

# --- Stage 2: Run the Application ---
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
# Copy the built JAR from the previous stage
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
