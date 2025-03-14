import { Component } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from "../shared/loader/loader.component";
import { NotificationComponent } from "../shared/notification/notification.component";

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, LoaderComponent, NotificationComponent],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PageComponent {
  loading = false;
  notification = {isFound: false, message: '', status: ''};

  onloading(value){
    this.loading = value;
  }
  onNotification(value){
    this.notification = value;
  }
}
