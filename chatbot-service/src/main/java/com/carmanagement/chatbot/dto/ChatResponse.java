package com.carmanagement.chatbot.dto;

import java.time.LocalDateTime;

/**
 * ==========================================
 * CHAT RESPONSE DTO
 * ==========================================
 * 
 * This represents the AI's response sent back to the frontend.
 * 
 * Fields:
 * - response: The AI's generated message
 * - sessionId: The session ID (echoed back for confirmation)
 * - timestamp: When the response was generated
 */
public class ChatResponse {

    private String response;
    private String sessionId;
    private LocalDateTime timestamp;

    // Default constructor
    public ChatResponse() {
    }

    // All-args constructor
    public ChatResponse(String response, String sessionId, LocalDateTime timestamp) {
        this.response = response;
        this.sessionId = sessionId;
        this.timestamp = timestamp;
    }

    // Builder pattern for easier construction
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String response;
        private String sessionId;
        private LocalDateTime timestamp;

        public Builder response(String response) {
            this.response = response;
            return this;
        }

        public Builder sessionId(String sessionId) {
            this.sessionId = sessionId;
            return this;
        }

        public Builder timestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public ChatResponse build() {
            return new ChatResponse(response, sessionId, timestamp);
        }
    }

    // Getters and Setters
    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
