package com.carmanagement.chatbot.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * ==========================================
 * CHAT REQUEST DTO
 * ==========================================
 * 
 * This represents an incoming chat message from the frontend.
 * 
 * Fields:
 * - message: The user's question or message
 * - sessionId: Unique identifier for this conversation
 * 
 * The sessionId is crucial for conversation memory!
 * The frontend should generate a unique ID (like a UUID) for each
 * new conversation and send the same ID for follow-up messages.
 */
public class ChatRequest {

    /**
     * The user's message to send to the AI.
     * Cannot be empty.
     */
    @NotBlank(message = "Message cannot be empty")
    private String message;

    /**
     * Session identifier for conversation memory.
     */
    private String sessionId;

    // Default constructor
    public ChatRequest() {
    }

    // All-args constructor
    public ChatRequest(String message, String sessionId) {
        this.message = message;
        this.sessionId = sessionId;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
}
