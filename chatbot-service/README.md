# 🤖 Chatbot Service - AI-Powered Car Assistant

This microservice provides an AI-powered chatbot for the car rental website, built with **Spring AI** and **Ollama** (running Llama 3.2 locally).

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Running the Service](#running-the-service)
- [Testing with Postman](#testing-with-postman)
- [API Reference](#api-reference)
- [How It Works](#how-it-works)
- [Configuration](#configuration)

---

## 🎯 Overview

The chatbot is a car expert assistant that can:
- ✅ Answer questions about car brands, models, and features
- ✅ Provide recommendations based on customer needs (family trips, business, adventure)
- ✅ Compare fuel efficiency and performance
- ✅ Remember conversation context within a session

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│  chatbot-service │────▶│     Ollama      │
│   (Angular)     │     │   (Port 8084)    │     │  (Port 11434)   │
│                 │◀────│                  │◀────│   Llama 3.2     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                      │
         │                      ▼
         │              ┌─────────────────┐
         └─────────────▶│   API Gateway   │
                        │   (Port 8080)   │
                        └─────────────────┘
```

### Key Components

| Component | Description |
|-----------|-------------|
| **Spring AI** | Framework that connects Spring Boot to AI models |
| **Ollama** | Local AI server that runs the Llama 3.2 model |
| **Llama 3.2** | Open-source language model (2GB, runs locally) |
| **ChatMemory** | Stores conversation history per session |

---

## 📦 Prerequisites

### 1. Install Ollama

Download from: https://ollama.com/download

### 2. Pull the Llama 3.2 Model

```bash
ollama pull llama3.2
```

### 3. Verify Ollama is Running

```bash
ollama list
# Should show: llama3.2:latest
```

---

## 🚀 Running the Service

### Option 1: Local Development

```bash
cd chatbot-service

# Windows
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

The service will start on **http://localhost:8084**

### Option 2: Docker Compose

```bash
# From the root project directory
docker-compose up -d ollama chatbot-service
```

---

## 🧪 Testing with Postman

### Step 1: Check Health Endpoint

**Request:**
```
GET http://localhost:8084/api/chat/health
```

**Expected Response:**
```
CarBot is ready to help! 🚗
```

---

### Step 2: Send a Chat Message

**Request:**
```
POST http://localhost:8084/api/chat
Content-Type: application/json

{
    "message": "What's a good car for a family trip?",
    "sessionId": "my-session-123"
}
```

**Expected Response:**
```json
{
    "response": "🌟 For a family trip, I'd recommend a vehicle that's comfortable, practical, and spacious. Here are some great options:\n\n1. **Toyota Highlander** - Seats 7-8, excellent reliability...",
    "sessionId": "my-session-123",
    "timestamp": "2024-01-28T14:30:00"
}
```

---

### Step 3: Test Conversation Memory

Send a follow-up message **with the same sessionId**:

**Request:**
```
POST http://localhost:8084/api/chat
Content-Type: application/json

{
    "message": "What about the fuel efficiency?",
    "sessionId": "my-session-123"
}
```

**Expected Response:**
The AI will remember you were asking about family cars and provide fuel efficiency info for those specific cars!

---

### Postman Collection Quick Setup

1. Open Postman
2. Create a new Collection called "Car Rental Chatbot"
3. Add these requests:

| Name | Method | URL |
|------|--------|-----|
| Health Check | GET | `http://localhost:8084/api/chat/health` |
| Send Message | POST | `http://localhost:8084/api/chat` |

For the POST request, set:
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
    "message": "Your question here",
    "sessionId": "unique-session-id"
}
```

---

## 📖 API Reference

### POST /api/chat

Send a message to the AI chatbot.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | ✅ Yes | The user's message |
| `sessionId` | string | ❌ No | Session ID for conversation memory. If not provided, a new one is generated. |

**Response:**

| Field | Type | Description |
|-------|------|-------------|
| `response` | string | The AI's response |
| `sessionId` | string | The session ID used |
| `timestamp` | string | ISO timestamp of the response |

---

### GET /api/chat/health

Check if the chatbot service is running.

**Response:** `CarBot is ready to help! 🚗`

---

## 🧠 How It Works

### 1. Spring AI Integration

The `pom.xml` includes the Spring AI Ollama starter:

```xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-ollama-spring-boot-starter</artifactId>
</dependency>
```

### 2. AI Configuration (ChatConfig.java)

```java
// System prompt defines the AI's personality
private static final String SYSTEM_PROMPT = """
    You are CarBot, an expert AI assistant for a car rental website.
    Your expertise includes:
    - Car brands, models, and their features
    - Fuel efficiency and performance comparisons
    - Recommendations based on customer needs
    ...
    """;

// ChatMemory stores conversation history per session
@Bean
public ChatMemory chatMemory() {
    return new InMemoryChatMemory();
}

// ChatClient is configured with system prompt and memory
@Bean
public ChatClient chatClient(ChatClient.Builder builder, ChatMemory chatMemory) {
    return builder
        .defaultSystem(SYSTEM_PROMPT)
        .defaultAdvisors(new MessageChatMemoryAdvisor(chatMemory))
        .build();
}
```

### 3. Calling the AI (ChatService.java)

```java
String aiResponse = chatClient.prompt()
    .user(request.getMessage())                    // User's question
    .advisors(spec -> spec
        .param(CHAT_MEMORY_CONVERSATION_ID_KEY, sessionId))  // Session for memory
    .call()                                         // Send to Ollama
    .content();                                     // Get text response
```

### 4. Connection Flow

1. User sends POST request with message + sessionId
2. ChatService retrieves conversation history for this sessionId
3. Spring AI sends the full context to Ollama (localhost:11434)
4. Ollama runs inference with Llama 3.2
5. Response is returned and stored in memory
6. JSON response sent back to user

---

## ⚙️ Configuration

### application.yml

```yaml
spring:
  ai:
    ollama:
      base-url: http://localhost:11434  # Ollama server URL
      chat:
        model: llama3.2                  # Model to use
        options:
          temperature: 0.7               # Creativity (0-1)
          num-predict: 500               # Max response tokens
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama server URL |
| `OLLAMA_MODEL` | `llama3.2` | Model to use |

---

## 🐳 Docker Configuration

When running with Docker, the service connects to the Ollama container:

```yaml
# docker-compose.yml
ollama:
  image: ollama/ollama:latest
  ports:
    - "11434:11434"

chatbot-service:
  build: ./chatbot-service
  ports:
    - "8084:8084"
  environment:
    OLLAMA_BASE_URL: http://ollama:11434
```

---

## 📝 Swagger Documentation

When the service is running, access the API docs at:

**http://localhost:8084/swagger-ui.html**

---

## 🔧 Troubleshooting

### "Connection refused" error

Make sure Ollama is running:
```bash
ollama serve
```

### Slow responses

First response may take 10-30 seconds as the model loads into memory. Subsequent responses are faster.

### Model not found

Pull the model:
```bash
ollama pull llama3.2
```

---

## 📚 Resources

- [Spring AI Documentation](https://docs.spring.io/spring-ai/reference/)
- [Ollama Documentation](https://ollama.com/)
- [Llama 3.2 Model](https://ollama.com/library/llama3.2)
