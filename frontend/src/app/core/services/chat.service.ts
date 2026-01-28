import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Interface for chat request
 */
export interface ChatRequest {
    message: string;
    sessionId: string;
}

/**
 * Interface for chat response
 */
export interface ChatResponse {
    response: string;
    sessionId: string;
    timestamp: string;
}

/**
 * Interface for a chat message in the UI
 */
export interface ChatMessage {
    content: string;
    isUser: boolean;
    timestamp: Date;
}

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private readonly SESSION_KEY = 'chat_session_id';

    // Signal to track chat messages
    private messagesSignal = signal<ChatMessage[]>([]);
    readonly messages = this.messagesSignal.asReadonly();

    // Signal to track loading state
    private loadingSignal = signal<boolean>(false);
    readonly isLoading = this.loadingSignal.asReadonly();

    // Signal to track if chat is open
    private chatOpenSignal = signal<boolean>(false);
    readonly isChatOpen = this.chatOpenSignal.asReadonly();

    constructor(private http: HttpClient) { }

    /**
     * Get or create a session ID for this chat conversation
     */
    getSessionId(): string {
        let sessionId = localStorage.getItem(this.SESSION_KEY);
        if (!sessionId) {
            sessionId = this.generateUUID();
            localStorage.setItem(this.SESSION_KEY, sessionId);
        }
        return sessionId;
    }

    /**
     * Clear the current session (start a new conversation)
     */
    clearSession(): void {
        localStorage.removeItem(this.SESSION_KEY);
        this.messagesSignal.set([]);
    }

    /**
     * Toggle chat widget open/closed
     */
    toggleChat(): void {
        this.chatOpenSignal.update(open => !open);
    }

    /**
     * Open the chat widget
     */
    openChat(): void {
        this.chatOpenSignal.set(true);
    }

    /**
     * Close the chat widget
     */
    closeChat(): void {
        this.chatOpenSignal.set(false);
    }

    /**
     * Send a message to the AI chatbot
     */
    sendMessage(message: string): Observable<ChatResponse> {
        // Add user message to the chat
        const userMessage: ChatMessage = {
            content: message,
            isUser: true,
            timestamp: new Date()
        };
        this.messagesSignal.update(msgs => [...msgs, userMessage]);

        // Set loading state
        this.loadingSignal.set(true);

        const request: ChatRequest = {
            message: message,
            sessionId: this.getSessionId()
        };

        return this.http.post<ChatResponse>(environment.chatUrl, request)
            .pipe(
                tap((response) => {
                    // Add AI response to the chat
                    const aiMessage: ChatMessage = {
                        content: response.response,
                        isUser: false,
                        timestamp: new Date(response.timestamp)
                    };
                    this.messagesSignal.update(msgs => [...msgs, aiMessage]);
                    this.loadingSignal.set(false);
                }),
                catchError((error) => {
                    console.error('Chat error:', error);
                    this.loadingSignal.set(false);

                    // Add error message to chat
                    const errorMessage: ChatMessage = {
                        content: 'Sorry, I encountered an error. Please make sure the chatbot service is running and try again. 🔧',
                        isUser: false,
                        timestamp: new Date()
                    };
                    this.messagesSignal.update(msgs => [...msgs, errorMessage]);

                    return throwError(() => new Error('Chat request failed'));
                })
            );
    }

    /**
     * Generate a UUID for session tracking
     */
    private generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
