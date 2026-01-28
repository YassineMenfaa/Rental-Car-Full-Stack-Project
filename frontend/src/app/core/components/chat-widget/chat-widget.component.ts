import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage } from '../../services/chat.service';

@Component({
    selector: 'app-chat-widget',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './chat-widget.component.html',
    styleUrl: './chat-widget.component.scss'
})
export class ChatWidgetComponent implements AfterViewChecked {
    @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
    @ViewChild('messageInput') private messageInput!: ElementRef;

    newMessage = '';
    private shouldScrollToBottom = false;

    constructor(public chatService: ChatService) { }

    ngAfterViewChecked(): void {
        if (this.shouldScrollToBottom) {
            this.scrollToBottom();
            this.shouldScrollToBottom = false;
        }
    }

    get messages(): ChatMessage[] {
        return this.chatService.messages();
    }

    get isLoading(): boolean {
        return this.chatService.isLoading();
    }

    get isChatOpen(): boolean {
        return this.chatService.isChatOpen();
    }

    toggleChat(): void {
        this.chatService.toggleChat();
        if (this.chatService.isChatOpen()) {
            setTimeout(() => {
                this.messageInput?.nativeElement?.focus();
                this.scrollToBottom();
            }, 100);
        }
    }

    closeChat(): void {
        this.chatService.closeChat();
    }

    sendMessage(): void {
        const message = this.newMessage.trim();
        if (!message || this.isLoading) return;

        this.newMessage = '';
        this.shouldScrollToBottom = true;

        this.chatService.sendMessage(message).subscribe({
            next: () => {
                this.shouldScrollToBottom = true;
            },
            error: (err) => {
                console.error('Failed to send message:', err);
            }
        });
    }

    onKeyPress(event: KeyboardEvent): void {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }

    startNewChat(): void {
        this.chatService.clearSession();
    }

    private scrollToBottom(): void {
        try {
            if (this.messagesContainer) {
                const container = this.messagesContainer.nativeElement;
                container.scrollTop = container.scrollHeight;
            }
        } catch (err) {
            console.error('Scroll error:', err);
        }
    }
}
