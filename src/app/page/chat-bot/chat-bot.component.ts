


import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, ViewChild, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { WebsocketService } from '../../services/websocket.service';
import { Subscription } from 'rxjs';

import { KeepHTMLPipe } from '../../validators/keep-html.pipe';
import { AnimatedTextComponent } from "../../shared/animated-text/animated-text.component";

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule, FormsModule, KeepHTMLPipe, AnimatedTextComponent],
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.css',
  animations: [
    trigger('messageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('chatWindow', [
      transition(':enter', [
        style({ transform: 'scale(0.5) translateY(20px)', opacity: 0 }),
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ transform: 'scale(1) translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'scale(0.5) translateY(20px)', opacity: 0 }))
      ])
    ])
  ]
})




export class ChatBotComponent implements OnDestroy {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  messages: Message[] = [];
  newMessage = '';
  isOpen = false;
  isTyping = false;
  showInputError = false;
  randomStr = Math.random().toString(36).substring(2, 6);
  
  private currentBotMessage: Message | null = null;
  private wsSubscriptions: Subscription[] = [];



  constructor(
    private elementRef: ElementRef,
    private websocketService: WebsocketService
  ) {}

  ngOnInit(): void {
    this.addBotMessage('Hello! How can I help you today?');
    this.setupWebSocketListeners();
  }

  ngOnDestroy(): void {
    this.wsSubscriptions.forEach(sub => sub.unsubscribe());
    this.websocketService.disconnect();
  }

  private setupWebSocketListeners(): void {
    this.wsSubscriptions.push(
      this.websocketService.onThinking.subscribe(() => {
        this.isTyping = true;
        this.scrollToBottom();
      }),

      this.websocketService.onMessage.subscribe(content => {
        this.handleBotResponse(content);
      }),

      this.websocketService.onError.subscribe(error => {
        this.isTyping = false;
        this.addBotMessage(error);
        this.currentBotMessage = null;
        this.scrollToBottom();
      })
    );
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  sendMessage(): void {
    const msg = this.newMessage.trim();
    if (!msg) {
      this.showInputError = true;
      setTimeout(() => this.showInputError = false, 500);
      return;
    }

    this.addUserMessage(msg);
    this.websocketService.sendMessage(msg);
    this.isTyping = true;

    this.currentBotMessage = null;
    this.newMessage = '';
  }

  private addUserMessage(text: string): void {
    this.messages.push({
      text,
      sender: 'user',
      timestamp: new Date()
    });
    this.scrollToBottom();
  }

  private addBotMessage(text: string): void {
    this.messages.push({
      text,
      sender: 'bot',
      timestamp: new Date()
    });
    this.scrollToBottom();
  }

  private handleBotResponse(content: string): void {
    if (!this.currentBotMessage) {
      this.currentBotMessage = {
        text: content,
        sender: 'bot',
        timestamp: new Date()
      };
      this.messages.push(this.currentBotMessage);
    } else {
      this.currentBotMessage.text += content;
    }
    
    this.isTyping = false;
    this.scrollToBottom();
  }

  public scrollToBottom(): void {
    try {
      setTimeout(() => {
        if (this.scrollContainer?.nativeElement) {
          this.scrollContainer.nativeElement.scrollTop = 
            this.scrollContainer.nativeElement.scrollHeight;
        }
      }, 100);
    } catch(err) { 
      console.error('Scroll error:', err); 
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    if (!this.isOpen) return;

    const chatWindow = this.elementRef.nativeElement.querySelector('.chat-window');
    const fabButton = this.elementRef.nativeElement.querySelector('.fab-button');

    const clickedInsideChat = chatWindow?.contains(event.target);
    const clickedOnButton = fabButton?.contains(event.target);

    if (!clickedInsideChat && !clickedOnButton) {
      this.isOpen = false;
    }
  }

  
}
