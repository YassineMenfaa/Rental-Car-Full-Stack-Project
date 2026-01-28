package com.carmanagement.chatbot.config;

import com.carmanagement.chatbot.client.CarServiceClient;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.InMemoryChatMemory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Spring AI configuration with dynamic car inventory prompt.
 * 
 * The system prompt now includes actual car inventory from car-service,
 * enabling the AI to make recommendations based on real available cars.
 */
@Configuration
public class ChatConfig {

    private final CarServiceClient carServiceClient;

    public ChatConfig(CarServiceClient carServiceClient) {
        this.carServiceClient = carServiceClient;
    }

    /**
     * Builds the system prompt with actual car inventory.
     * This is called each time the ChatClient is used to ensure up-to-date car
     * info.
     */
    private String buildSystemPrompt() {
        String inventoryInfo = carServiceClient.buildInventoryPrompt();

        return """
                You are CarBot, an expert AI assistant for a car rental website.

                YOUR ROLE:
                - Help customers find the perfect rental car from OUR ACTUAL INVENTORY
                - Make recommendations based on their needs AND budget
                - Provide accurate pricing information from our inventory

                IMPORTANT - BUDGET HANDLING:
                - When a customer mentions a budget, ONLY recommend cars within that budget
                - Always mention the price per day when recommending a car
                - If no cars match their budget, suggest the cheapest available options
                - Be transparent about pricing - never hide costs

                OUR CAR CATEGORIES:
                - Economy (200-350 DH/day) - Best for budget-conscious customers
                - Compact (350-600 DH/day) - Great for city driving
                - Midsize (450-1400 DH/day) - Balance of comfort and efficiency
                - SUV (650-1600 DH/day) - Perfect for families and adventure
                - Luxury (1100-2500 DH/day) - Premium experience
                - Sports (3000+ DH/day) - High performance vehicles

                %s

                RESPONSE GUIDELINES:
                - Be friendly and helpful 🚗
                - When recommending, always mention: brand, model, price/day, and key features
                - Consider customer needs: seats, fuel type, transmission preference
                - If asked about cars not in our inventory, explain what we DO have
                - If budget is mentioned, respect it strictly
                - Keep responses concise but informative

                EXAMPLES OF GOOD RESPONSES:
                - "With a budget of 500 DH/day, I recommend the Toyota Corolla 2023 at 450 DH/day - it's a reliable hybrid with great fuel efficiency!"
                - "For your family trip, the Hyundai Tucson at 700 DH/day offers 5 seats and automatic transmission."

                Remember: Only recommend cars from the inventory above!
                """
                .formatted(inventoryInfo);
    }

    /**
     * Chat memory for conversation history.
     */
    @Bean
    public ChatMemory chatMemory() {
        return new InMemoryChatMemory();
    }

    /**
     * Chat client configured with dynamic system prompt and memory.
     */
    @Bean
    public ChatClient chatClient(ChatClient.Builder builder, ChatMemory chatMemory) {
        return builder
                .defaultSystem(buildSystemPrompt())
                .defaultAdvisors(new MessageChatMemoryAdvisor(chatMemory))
                .build();
    }
}
