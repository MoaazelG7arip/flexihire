import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { NotificationComponent } from "../../shared/notification/notification.component";

declare var Pusher: any;


@Component({
  selector: 'app-real-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent, NotificationComponent],
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

  userChat;
  searchTerm: string = '';
  contactorsFiltered: any[] = []; 
  chatType: string;
  chatMobileChange:boolean = false;
  loading:boolean = false;
  notification = {isFound: false, message: '', status: ''};


  private pusher: any;
  private channel: any;


  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  

  ngOnInit() {

    this.user = sessionStorage.getItem('userChat') ? JSON.parse(sessionStorage.getItem('userChat')) : null;
    
    if(localStorage.getItem('user')){
      this.token = JSON.parse(localStorage.getItem('user')).token;
      this.currentUserId = JSON.parse(localStorage.getItem('user')).user.id;
    }
    if(sessionStorage.getItem('receiverId')) {
      this.receiverId = JSON.parse(sessionStorage.getItem('receiverId'));
      console.log('receiverId of sessionStorage',this.receiverId)
      this.getChatWithSomeone(this.receiverId);
    }
    if(this.user != null || this.user != undefined){
      console.log('this.user',this.user)
      this.receiverId = this.user.id;
      sessionStorage.setItem('receiverId', this.receiverId.toString());
      console.log('receiverId of user', this.receiverId)
      this.getChatWithSomeone(this.receiverId);
      sessionStorage.removeItem('userChat');
    }
    if(sessionStorage.getItem('chatType')){
      this.chatType = sessionStorage.getItem('chatType');
    } else {
      this.chatType = 'company';
    }
    if(sessionStorage.getItem('chatMobileChange')){
      this.chatMobileChange = JSON.parse(sessionStorage.getItem('chatMobileChange'));
      sessionStorage.removeItem('chatMobileChange');
      console.log(this.chatMobileChange)
    }

    this.getContactors();


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

        this.notification = {
          isFound: true,
          message: errorMsg,
          status: 'alert',
        };
        setTimeout(() => {
          this.notification = { isFound: false, message: '', status: '' };
        }, 3500);

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

        this.notification = {
          isFound: true,
          message: errorMsg,
          status: 'alert',
        };
        setTimeout(() => {
          this.notification = { isFound: false, message: '', status: '' };
        }, 3500);

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
    this.newMessage = '';
    if (!message || !this.receiverId) return;

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/json'
    });

    this.http.post(`${this.base_API}/send-chat/${this.receiverId}`, { message }, { headers }).subscribe({
      next: (res) => {
        console.log('sender is',res)
        this.addMessage(message, true, res['data']['sender'], new Date());
        // this.newMessage = '';

        if(this.user){

          this.getContactors();

          sessionStorage.removeItem('userChat');
          this.user = null;
          console.log('this.user',this.user)

        }
      },
      error: (err) => {
        // this.showStatus(`Failed to send: ${err.message}`, true);

                this.notification = {
          isFound: true,
          message: err.message || 'Error fetching applications',
          status: 'alert',
        };
        setTimeout(() => {
          this.notification = { isFound: false, message: '', status: '' };
        }, 3500);

        console.error(err);
      }
    });
  }
  onChangeChatAgain(){

    if(!this.chatMobileChange){
      this.onchatMobileChange()
    }

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
    this.scrollToBottom();
  }

  getChatWithSomeone(id) {
    this.receiverId = id;
    console.log(this.receiverId)
    sessionStorage.setItem('receiverId', this.receiverId.toString());
    this.connect();

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/json'
    });
    this.loading = true;
    this.http.get(`${this.base_API}/get-chat/${this.receiverId}`, { headers }).subscribe({
      next: (res: any) => {
        console.log(res);
        this.messages = res['messages'];
        this.loading = false;

        if(this.user && this.messages.length == 0){
          this.newMessage = 'Welcome in a New Chat';
          this.sendMessage();
        }

        
        this.contactors.forEach((contactor) => {
          if (contactor.id == this.receiverId) {
            this.userChat = contactor;
          }
        });
        console.log(this.receiverId)
        console.log('this.userChat',this.userChat)

        
        this.scrollToBottom();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  getContactors(){
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/json'
    });
    this.loading = true;
    this.http.get(this.base_API + `/contacts`, { headers }).subscribe({
      next: (res: any) => {
        console.log(res);
        this.loading = false;
        this.contactors = res['contacts'];
        this.contactorsFiltered = this.contactors;

        this.contactors.forEach((contactor) => {
          if (contactor.id == this.receiverId) {
            this.userChat = contactor;
          }
        });

      },
      error: (err) => {
        console.error(err);
      }
    })

  }

  onChangeChatType(chatType:string){
    this.chatType = chatType;
    sessionStorage.setItem('chatType', this.chatType)
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


  onSearchContractor(){
    if(this.searchTerm.length > 0) {
      this.contactorsFiltered = this.contactors.filter((contactor) => {
        let name = contactor.first_name + ' ' + contactor.last_name;
        return name.toLowerCase().includes(this.searchTerm.toLowerCase())
      })
      // console.log(this.contactors)
    } else {
      // this.getContactors();
      this.contactorsFiltered = this.contactors;
    }
  }

  onchatMobileChange(){
    this.chatMobileChange = !this.chatMobileChange;
    sessionStorage.setItem('chatMobileChange', JSON.stringify(this.chatMobileChange))
  }

}