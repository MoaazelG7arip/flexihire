import { Component, inject } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { Router, RouterOutlet } from '@angular/router';
import { LoaderComponent } from "../shared/loader/loader.component";
import { ChatBotComponent } from "./chat-bot/chat-bot.component";
import { BridgeService } from '../services/bridge.service';
import { FooterComponent } from "./footer/footer.component";

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, LoaderComponent, ChatBotComponent, FooterComponent],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PageComponent {
  loading : boolean = false;
  notification = {isFound: false, message: '', status: ''};


  bridgeService: BridgeService = inject(BridgeService);
  router: Router = inject(Router);

  ngOnInit(): void {
  
  }


  onloading(value){
    this.loading = value;
  }
  onNotification(value){
    this.notification = value;
  }

  get showFooter(): boolean {
    // Adjust the path as needed for your routing structure
    return !(this.router.url.includes('/page/real-chat') || this.router.url.includes('/rateUs')) ;
  }

  

}
