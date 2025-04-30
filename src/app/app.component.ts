import { Component, inject } from '@angular/core';
import { Tooltip, initTWE } from 'tw-elements';
import { AuthComponent } from './auth/auth.component';
import { NotificationComponent } from "./shared/notification/notification.component";
import { BridgeService } from './services/bridge.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AuthComponent, NotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'flexihire';
  notification = {isFound: false, message: '', status: ''};

  bridgeService: BridgeService = inject(BridgeService);


  ngOnInit() {
    initTWE({ Tooltip });

    this.bridgeService.notification.subscribe((data)=>{
      this.notification = data;
      if(this.notification.isFound) {
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);
    }
    });
  }
}
