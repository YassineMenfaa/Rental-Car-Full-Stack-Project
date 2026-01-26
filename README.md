# Car Management System

A comprehensive Car Management System built with a microservices architecture, featuring a modern Angular frontend and a robust Spring Boot backend.

## 🚀 Technologies

### Backend
*   **Java 17**
*   **Spring Boot 3.2.5**
*   **Spring Cloud** (Netflix Eureka)
*   **Spring Security** + **JWT** for Authentication
*   **PostgreSQL** (Database)
*   **OpenAPI / Swagger** (Documentation)
*   **Lombok**

### Frontend
*   **Angular 19**
*   **TypeScript**
*   **RxJS**

### Infrastructure
*   **Docker** & **Docker Compose**
*   **API Gateway** for routing

## 🏗 Architecture

The system is composed of several microservices orchestrating together:

| Service | Port | Description |
| :--- | :--- | :--- |
| **API Gateway** | `8080` | Entry point for all requests, routing them to appropriate services. |
| **Eureka Server** | `8761` | Service Discovery Server for registering and locating microservices. |
| **Auth Service** | `8081` | Handles User Registration, Authentication, and Authorization (JWT). |
| **Car Service** | `8082` | Manages Car inventory, details, and specifications. |
| **Rental Service** | `8083` | Handles car rental operations and bookings. |
| **Frontend** | `4200` | The User Interface served by Angular CLI (when running locally). |

### Databases
Each service has its own dedicated PostgreSQL database instance to ensure loose coupling:
*   `auth_db` (Port 5432)
*   `car_db` (Port 5433)
*   `rental_db` (Port 5434)

## 🛠️ Getting Started

### Prerequisites
*   [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed.
*   [Node.js](https://nodejs.org/) (v18+ recommended) and `npm`.
*   [Java 17 SDK](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) (if running services locally without Docker).

### Running the Application (Docker)

The easiest way to run the entire backend stack is using Docker Compose.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YassineMenfaa/Rental-Car-Full-Stack-Project.git
    cd Car-Management-System
    ```

2.  **Start the services:**
    ```bash
    docker-compose up --build
    ```
    This command will build the images for API Gateway, Eureka, and all services, and start them along with the PostgreSQL databases.

3.  **Access the application:**
    *   **Eureka Dashboard:** [http://localhost:8761](http://localhost:8761)
    *   **API Gateway:** [http://localhost:8080](http://localhost:8080)

### Running the Frontend

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    ng serve
    ```

4.  Open your browser and navigate to `http://localhost:4200`.

## 📚 API Documentation

Once the services are running, you can access the Swagger UI for specific services (if enabled) generally at:
*   `http://localhost:<SERVICE_PORT>/swagger-ui.html`

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request.
