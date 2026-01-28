package com.carmanagement.chatbot.controller;

import com.carmanagement.chatbot.dto.ChatRequest;
import com.carmanagement.chatbot.dto.ChatResponse;
import com.carmanagement.chatbot.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * ==========================================
 * CHAT CONTROLLER
 * ==========================================
 * 
 * REST API endpoints for the chatbot.
 * 
 * Endpoints:
 * - POST /api/chat - Send a message and get a response
 * - GET /api/chat/health - Check if the chatbot is working
 * 
 * CORS is configured to allow requests from the Angular frontend.
 */
@RestController
@RequestMapping("/api/chat")
@Tag(name = "Chat", description = "AI Chatbot API")
@CrossOrigin(origins = { "http://localhost:4200", "http://localhost:80" })
public class ChatController {

    private static final Logger log = LoggerFactory.getLogger(ChatController.class);

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    /**
     * ==========================================
     * MAIN CHAT ENDPOINT
     * ==========================================
     * 
     * Receives a user message and returns the AI's response.
     * 
     * How to use from Angular:
     * 
     * POST /api/chat
     * Content-Type: application/json
     * {
     * "message": "What's a good car for a family trip?",
     * "sessionId": "550e8400-e29b-41d4-a716-446655440000"
     * }
     * 
     * Response:
     * {
     * "response": "For a family trip, I'd recommend...",
     * "sessionId": "550e8400-e29b-41d4-a716-446655440000",
     * "timestamp": "2024-01-28T14:30:00"
     * }
     */
    @PostMapping
    @Operation(summary = "Send a message to the AI chatbot", description = "Send a message and receive an AI-generated response. "
            +
            "Include sessionId for conversation memory.")
    public ResponseEntity<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
        log.info("Received chat request");
        ChatResponse response = chatService.chat(request);
        return ResponseEntity.ok(response);
    }

    /**
     * ==========================================
     * HEALTH CHECK ENDPOINT
     * ==========================================
     * 
     * Simple endpoint to verify the chatbot service is running.
     * Useful for debugging and load balancer health checks.
     */
    @GetMapping("/health")
    @Operation(summary = "Check chatbot health", description = "Verify the chatbot service is running")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("CarBot is ready to help! 🚗");
    }
}
