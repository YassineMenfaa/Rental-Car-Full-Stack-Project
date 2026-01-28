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
| **Chatbot Service** | `8084` | AI-powered car assistant using Spring AI + Ollama (Llama 3.2). |
| **Frontend** | `4200` | The User Interface served by Angular CLI (when running locally). |

---

## 🤖 AI Chatbot Setup

The chatbot uses **Ollama** to run a local AI model (Llama 3.2). The AI model is NOT included in this repository and must be installed separately.

### Prerequisites

1. **Install Ollama** - Download from [ollama.com/download](https://ollama.com/download)
   - Windows: Run the installer
   - Mac: `brew install ollama`
   - Linux: `curl -fsSL https://ollama.com/install.sh | sh`

2. **Verify installation:**
   ```bash
   ollama --version
   ```

### Model Download

Pull the Llama 3.2 model (~2GB download):

```bash
ollama pull llama3.2
```

Verify the model is installed:
```bash
ollama list
# Should show: llama3.2:latest
```

### Service Startup Order

Start services in this order:

1. **Start Ollama** (usually auto-starts after installation):
   ```bash
   ollama serve
   ```

2. **Start databases** (Docker):
   ```bash
   docker-compose up -d postgres-auth postgres-car postgres-rental
   ```

3. **Start Eureka Server**:
   ```bash
   cd eureka-server && ./mvnw spring-boot:run
   ```

4. **Start backend services** (in separate terminals):
   ```bash
   cd auth-service && ./mvnw spring-boot:run
   cd car-service && ./mvnw spring-boot:run
   cd rental-service && ./mvnw spring-boot:run
   cd chatbot-service && ./mvnw spring-boot:run
   ```

5. **Start API Gateway**:
   ```bash
   cd api-gateway && ./mvnw spring-boot:run
   ```

6. **Start Frontend**:
   ```bash
   cd frontend && npm install && npm start
   ```

### Testing the Chatbot

**Option 1: Via Frontend**
- Open http://localhost:4200
- Click the purple chat button (bottom-right corner)
- Ask: "What cars do you have available?"

**Option 2: Via API (Postman/curl)**

Health check:
```bash
curl http://localhost:8084/api/chat/health
```

Send a message:
```bash
curl -X POST http://localhost:8084/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I have a budget of 500 DH, what cars can I rent?", "sessionId": "test-123"}'
```

### Troubleshooting

| Issue | Solution |
|-------|----------|
| "Connection refused" | Make sure Ollama is running: `ollama serve` |
| Slow responses | First response takes 10-30s as model loads into memory |
| "Model not found" | Run: `ollama pull llama3.2` |

---


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

Option A: Build from Source (Recommended for Developers)
Download and RUN the project:
git clone https://github.com/YassineMenfaa/Rental-Car-Full-Stack-Project.git
cd Rental-Car-Full-Stack-Project-main

docker-compose up --build

Option B: Run from Docker Hub (Fastest for Users)
If your wants to run the app without building the code:

Download the project:

git clone https://github.com/YassineMenfaa/Rental-Car-Full-Stack-Project.git
cd Rental-Car-Full-Stack-Project-main

Start using pre-built images:

docker-compose -f docker-compose.prod.yml up -d


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
