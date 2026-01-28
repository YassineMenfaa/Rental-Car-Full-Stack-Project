package com.carmanagement.chatbot.service;

import com.carmanagement.chatbot.client.CarServiceClient;
import com.carmanagement.chatbot.dto.ChatRequest;
import com.carmanagement.chatbot.dto.ChatResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.springframework.ai.chat.client.advisor.AbstractChatMemoryAdvisor.CHAT_MEMORY_CONVERSATION_ID_KEY;

/**
 * Chat Service - Handles AI conversations with dynamic car inventory.
 */
@Service
public class ChatService {

    private static final Logger log = LoggerFactory.getLogger(ChatService.class);

    private final ChatClient chatClient;
    private final CarServiceClient carServiceClient;

    public ChatService(ChatClient chatClient, CarServiceClient carServiceClient) {
        this.chatClient = chatClient;
        this.carServiceClient = carServiceClient;
    }

    /**
     * Process a chat message and return the AI's response.
     * The system prompt is built dynamically with current car inventory.
     */
    public ChatResponse chat(ChatRequest request) {
        String sessionId = getOrCreateSessionId(request.getSessionId());

        log.info("Processing chat request for session: {}", sessionId);
        log.debug("User message: {}", request.getMessage());

        try {
            // Build dynamic system prompt with current car inventory
            String systemPrompt = buildDynamicSystemPrompt();

            log.debug("System prompt built with {} characters", systemPrompt.length());

            // Call the AI with dynamic system prompt
            String aiResponse = chatClient.prompt()
                    .system(systemPrompt) // Override with fresh inventory
                    .user(request.getMessage())
                    .advisors(advisorSpec -> advisorSpec
                            .param(CHAT_MEMORY_CONVERSATION_ID_KEY, sessionId))
                    .call()
                    .content();

            log.debug("AI response: {}", aiResponse);

            return ChatResponse.builder()
                    .response(aiResponse)
                    .sessionId(sessionId)
                    .timestamp(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            log.error("Error processing chat request: {}", e.getMessage(), e);

            return ChatResponse.builder()
                    .response("I'm sorry, I encountered an issue processing your request. " +
                            "Please make sure Ollama is running and try again. 🔧")
                    .sessionId(sessionId)
                    .timestamp(LocalDateTime.now())
                    .build();
        }
    }

    /**
     * Build the system prompt dynamically with current car inventory.
     * This ensures the AI always has the latest car data.
     */
    private String buildDynamicSystemPrompt() {
        String inventoryInfo = carServiceClient.buildInventoryPrompt();

        return """
                You are CarBot, an AI assistant for a car rental website.

                CRITICAL RULES:
                1. ONLY recommend cars from the inventory listed below
                2. NEVER invent or suggest cars that are not in our inventory
                3. When a user mentions a budget, ONLY show cars within that price
                4. Always include the exact price per day when recommending a car
                5. If we don't have a car that matches their needs, say so honestly

                BUDGET HANDLING:
                - If user says "budget of 500 DH" → only show cars ≤ 500 DH/day
                - Always mention prices so users can make informed decisions
                - Suggest the best value within their budget

                %s

                RESPONSE STYLE:
                - Be helpful and friendly 🚗
                - When listing cars, use this format:
                  • [Brand Model Year] - [Price] DH/day, [Fuel], [Transmission], [Seats] seats
                - Keep responses concise but informative
                - If asked about cars not in inventory, say "We don't currently have that model, but here's what we do have..."

                REMEMBER: You can ONLY recommend cars from the inventory above!
                """
                .formatted(inventoryInfo);
    }

    private String getOrCreateSessionId(String providedSessionId) {
        if (providedSessionId != null && !providedSessionId.isBlank()) {
            return providedSessionId;
        }
        return UUID.randomUUID().toString();
    }
}
