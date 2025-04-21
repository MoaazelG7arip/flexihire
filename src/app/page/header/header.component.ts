import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Collapse, Dropdown, initTWE} from "tw-elements";
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  user;
  loggedIn = false;
  image_url = null;

  @Output() onloading : EventEmitter<boolean> = new EventEmitter();
  loading: boolean = false;
  @Output() onNotification : EventEmitter<object> = new EventEmitter();
  notification = {isFound: false, message: '', status: ''};


  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  ngOnInit(): void {
    initTWE({ Collapse, Dropdown }); // Initialize required components
    let user = JSON.parse(sessionStorage.getItem('user'));
    if(user){
      this.loggedIn = true;
      this.authService.user.subscribe((data)=>{
        if(data){
          this.user = data;
          this.image_url = data.user.image_url;
        }
      })
    }
  }

  onLogout(){
    this.loading = true;
    this.onloading.emit(this.loading);
    let user = JSON.parse(sessionStorage.getItem('user'));
    if(user){
      this.authService.onLogout().subscribe({
        next: res => {
          console.log(res);
          this.loading = false;
          this.onloading.emit(this.loading);
          sessionStorage.removeItem('user');
          this.authService.user.next(null);
          this.loggedIn = false;
          this.router.navigate(['/auth/welcome']);
          // end
          this.notification = {
            isFound: true,
            message: res['message'] || 'Login Successfully',
            status:'success'
          };
          this.onNotification.emit(this.notification);
          setTimeout(() => {
            this.notification = {isFound: false, message: '', status: ''};
            this.onNotification.emit(this.notification);
          }, 3500);

        },
        error: err => {
          console.error(err);
          this.loading = false;
          this.onloading.emit(this.loading);
          this.notification = {
            isFound: true,
            message: err.error.message,
            status: 'alert',
          };
          this.onNotification.emit(this.notification);
          setTimeout(() => {
            this.notification = {isFound: false, message: '', status: ''};
            this.onNotification.emit(this.notification);
          }, 3500);
        }
      })
    }
  }





}
