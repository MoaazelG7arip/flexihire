import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { first } from 'rxjs';

declare var Pusher: any;


@Component({
  selector: 'app-real-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './real-chat.component.html',
  styleUrl: './real-chat.component.css'
})
export class RealChatComponent {

  currentUserId: number;
  receiverId: number;
  newMessage: string = '';
  messages: any[] = [];
  statusMessage: string = '';
  statusClasses: string = '';
  private base_API = "https://c.jordanwebmaster.com/flexihire/public/api/chat";
  private token;
  contactors: any[] = [];
  user: any = null;


  private pusher: any;
  private channel: any;


  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);


  ngOnInit() {

    this.user = sessionStorage.getItem('userChat') ? JSON.parse(sessionStorage.getItem('userChat')) : null;
    
    if(localStorage.getItem('user')){
      this.token = JSON.parse(localStorage.getItem('user')).token;
      this.currentUserId = JSON.parse(localStorage.getItem('user')).user.id;
    }
    if(sessionStorage.getItem('receiverId')) {
      this.receiverId = parseInt(sessionStorage.getItem('receiverId'));
      this.getChatWithSomeone(this.receiverId);
    }
    if(this.user){
      console.log('this.user',this.user)
      this.receiverId = this.user.id;
      this.getChatWithSomeone(this.user.id);
    }
    this.getContactors();


// #####################







  }

  ngOnDestroy() {
    if (this.pusher) this.pusher.disconnect();
  }


  connect() {
    this.initPusher();
    this.messages = [];
  }

  // private showStatus(message: string, isError: boolean = false) {
  //   this.statusMessage = message;
  //   this.statusClasses = isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
  // }

  private initPusher() {
    if (this.pusher) this.pusher.disconnect();

    this.pusher = new Pusher('1592f4180794c697061f', {
      cluster: 'eu',
      authEndpoint: 'https://c.jordanwebmaster.com/flexihire/public/api/broadcasting/auth',
      auth: {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json'
        }
      },
      encrypted: true
    });

    this.pusher.connection.bind('connected', () => {
      // this.showStatus('Connected to chat service');
      this.subscribeToChannel();
    });

    this.pusher.connection.bind('error', (err: any) => {
      const errorMsg = err?.message || JSON.stringify(err) || 'Unknown error';
      // this.showStatus(`Connection error: ${errorMsg}`, true);
    });
  }

  private subscribeToChannel() {
    const user1 = Math.min(this.currentUserId, this.receiverId);
    const user2 = Math.max(this.currentUserId, this.receiverId);
    const channelName = `chat.${user1}-${user2}`;

    this.channel = this.pusher.subscribe(channelName);

    this.channel.bind('pusher:subscription_succeeded', () => {
      // this.showStatus('Subscribed to channel');
    });

    this.channel.bind('pusher:subscription_error', (error: any) => {
      const errorMsg = error?.message || error?.error || JSON.stringify(error) || 'Unknown error';
      // this.showStatus(`Failed to connect: ${errorMsg}`, true);
    });

    this.channel.bind('new.message', (data: any) => {
      if (this.receiverId === data.from_id) {
        this.addMessage(data.message, false, data, new Date(data.timestamp));
        console.log('receiver is',data)
      }
    });
  }

  sendMessage() {
    const message = this.newMessage.trim();
    if (!message || !this.receiverId) return;

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/json'
    });

    this.http.post(`${this.base_API}/send-chat/${this.receiverId}`, { message }, { headers }).subscribe({
      next: (res) => {
        console.log('sender is',res)
        this.addMessage(message, true, res['data']['sender'], new Date());
        this.newMessage = '';

        if(this.user){

          this.getContactors();

          sessionStorage.removeItem('userChat');
          this.user = null;
          console.log('this.user',this.user)


        }
      },
      error: (err) => {
        // this.showStatus(`Failed to send: ${err.message}`, true);
        console.error(err);
      }
    });
  }

  private addMessage(text: string, isMine: boolean, sender, timestamp: Date) {
    this.messages.push({
      message: text,
      is_mine: isMine,
      sender: sender,
      sent_at: timestamp
    });
    // Trigger change detection
    this.messages = [...this.messages];
  }

  getChatWithSomeone(id) {
    this.receiverId = id;
    sessionStorage.setItem('receiverId', this.receiverId.toString());
    this.connect();

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/json'
    });

    this.http.get(`${this.base_API}/get-chat/${this.receiverId}`, { headers }).subscribe({
      next: (res: any) => {
        console.log(res);
        this.messages = res['messages'];
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getContactors(){
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/json'
    });

    this.http.get(this.base_API + `/contacts`, { headers }).subscribe({
      next: (res: any) => {
        console.log(res);
        this.contactors = res['contacts'];

      },
      error: (err) => {
        console.error(err);
      }
    })

  }


}