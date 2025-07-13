import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface ChatMessage {
  type: 'stream_chunk' | 'stream_start' | 'stream_end' | 'error' | 'thinking';
  content?: string;
  message?: {
    content: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private ws!: WebSocket;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  // Message streams
  public onMessage = new Subject<string>();
  public onError = new Subject<string>();
  public onThinking = new Subject<void>();

  private baseApi = 'e8ba80203000.ngrok-free.app';

  constructor() {
    this.connect();
  }

  private connect(): void {
    try {
      this.ws = new WebSocket(
        `wss://${this.baseApi}/ws/user_${Date.now()}`
      );
      this.ws.onopen = () => {
        console.log('Connected to chatbot');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event: MessageEvent) => {
        try {
          const data: ChatMessage = JSON.parse(event.data);
          console.log(data)
          this.onMessage.next(data.content);
          // this.handleMessage(data);
        } catch (error) {
          this.onError.next('Failed to parse server response');
        }
      };

      this.ws.onclose = () => {
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.onError.next('Connection error occurred');
      };
    } catch (error) {
      this.onError.next('Failed to establish connection');
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(
          `Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
        );
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      this.onError.next('Connection lost. Please refresh the page.');
    }
  }

  public sendMessage(text: string): void {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ content: text.trim() }));
    } else {
      this.onError.next('Not connected. Please wait...');
    }
  }

  public disconnect(): void {
    this.ws?.close();
  }





  newConnection(api:string){
    this.baseApi = api;
    this.connect();
  }
}
