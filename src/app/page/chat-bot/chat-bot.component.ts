import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';



import { trigger, state, style, transition, animate } from '@angular/animations';
import { ChatBotService } from '../../services/chat-bot.service';


interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}


@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
export class ChatBotComponent {


  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  chatBotService: ChatBotService = inject(ChatBotService)
  
  messages: Message[] = [];
  newMessage = '';
  isOpen = false;
  isTyping = false;
  showInputError = false;
  randomStr = Math.random().toString(36).substring(2, 6); // Random string for session_id
  
  constructor(private elementRef: ElementRef) {}
  
  ngOnInit(): void {
    this.addBotMessage('Hello! How can I help you today?');
    
  }
  
    
  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  sendMessage(): void {
    const msg = this.newMessage.trim();
    if (!msg) {
      this.showInputError = true;
      setTimeout(() => this.showInputError = false, 500);
      return;
    }

    this.addUserMessage(msg);
    this.simulateBotResponse();

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

  private simulateBotResponse(): void {
    this.isTyping = true;

    const msg = this.newMessage.trim();

    const body = {
      input: msg,
      // session_id: 'session_5'
      session_id: this.randomStr
    }

    console.log(body);

    this.chatBotService.getResponse(body).subscribe({
      next: (response) => {
        console.log(response);
        this.isTyping = false;
        this.addBotMessage(response['answer']);
      },
      error: (error) => {
        // console.error('Error:', error);
        setTimeout(() => {
          this.isTyping = false;
          this.addBotMessage('Sorry, I could not process your request.');
        }, 3000);
      }
    })




    // setTimeout(() => {
    //   this.addBotMessage('This is a sample response. Implement your bot logic here.');
    //   this.isTyping = false;


    //   // Scroll to the bottom after the bot message is added
    //   this.scrollToBottom();

    // }, 1500);

  }

  private scrollToBottom(): void {
    try {
      setTimeout(() => {
        if (this.scrollContainer?.nativeElement) {
          this.scrollContainer.nativeElement.scrollTop = 
            this.scrollContainer.nativeElement.scrollHeight;
        }
      }, 100);
    } catch(err) { /* Handle error */ }
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
