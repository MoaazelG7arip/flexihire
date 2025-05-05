import { Component, inject } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from "../shared/loader/loader.component";
import { ChatBotComponent } from "./chat-bot/chat-bot.component";
import { BridgeService } from '../services/bridge.service';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, LoaderComponent, ChatBotComponent],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PageComponent {
  loading = false;
  notification = {isFound: false, message: '', status: ''};


  bridgeService: BridgeService = inject(BridgeService);


  ngOnInit(): void {
  
  }


  onloading(value){
    this.loading = value;
  }
  onNotification(value){
    this.notification = value;
  }

  

}
