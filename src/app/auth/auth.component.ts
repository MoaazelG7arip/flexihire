import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { NotificationComponent } from "../shared/notification/notification.component";
import { BridgeService } from '../services/bridge.service';



@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterOutlet , NotificationComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {


  loading: boolean = false;
  notification = {isFound: false, message: '', status: ''};
  
  logForm: any;
  regForm: any;
  forgotForm: any;
  resetForm: any;

  bridgeService: BridgeService = inject(BridgeService);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  ngOnInit(): void {
    this.bridgeService.logForm.subscribe((data)=>{
      this.logForm = data;
      this.onLogin();
    })
    this.bridgeService.regForm.subscribe((data)=>{
      this.regForm = data;
      this.onRegisteration();
    });
    this.bridgeService.forgotForm.subscribe((data)=>{
      this.forgotForm = data;
      this.onForgetPassword();
    });
    this.bridgeService.resetForm.subscribe((data)=>{
      this.resetForm = data;
      this.onReset();
    });
  }

  onRegisteration(){
    this.loading = true;
    this.bridgeService.getLoading(this.loading)
    this.authService.onRegister(this.regForm).subscribe({
      next: res => {
        console.log(res);
        this.loading = false;
        this.bridgeService.getLoading(this.loading)
        this.authService.user.next(res);
        sessionStorage.setItem('user', JSON.stringify(res));
        sessionStorage.setItem('addInfo', 'true');
        // routing to home page
        this.router.navigate(['/page/jobs']);
        // end
        this.notification = {
          isFound: true,
          message: res['message'] || "Registration Successfully",
          status:'success'
        };
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);
      },
      error: err => {
        console.error(err);
        this.notification = {
          isFound: true,
          message: err.error.errors.email[0] || err.error.message,
          status: 'alert'
        };
        this.loading = false;
        this.bridgeService.getLoading(this.loading)
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);
      }
    })
  }
  onLogin(){
    this.loading = true;
    this.bridgeService.getLoading(this.loading)
    this.authService.onLogin(this.logForm).subscribe({
      next: res => {
        console.log(res);
        this.loading = false;
        this.bridgeService.getLoading(this.loading);
        this.authService.user.next(res);
        sessionStorage.setItem('user', JSON.stringify(res));
        // routing to home page
         
        this.router.navigate(['/page/jobs']);
        // end
        this.notification = {
          isFound: true,
          message: res['message'] || 'Login Successfully',
          status:'success'
        };
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);
      },
      error: err => {
        console.error(err);
        this.loading = false;
        this.bridgeService.getLoading(this.loading)
        this.notification = {
          isFound: true,
          message: err.error.message,
          status: 'alert',
        };
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);
      }
    })
  }

  onForgetPassword(){
    this.loading = true;
    this.bridgeService.getLoading(this.loading)
    this.authService.onForgetPassword(this.forgotForm).subscribe({
      next: res => {
        console.log(res);
        this.loading = false;
        this.bridgeService.getLoading(this.loading)
        sessionStorage.setItem('email', this.forgotForm.email);
        this.notification = {
          isFound: true,
          message: res['message'],
          status:'success'
        };
        this.router.navigate(['/auth/reset-password']);
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);
      },
      error: err => {
        console.error(err);
        this.loading = false;
        this.bridgeService.getLoading(this.loading)
        this.notification = {
          isFound: true,
          message: err.error.message,
          status: 'alert',
        };
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);
      }
    })
  }

  onReset(){
    this.loading = true;
    this.bridgeService.getLoading(this.loading)
    this.authService.onResetPassword(this.resetForm).subscribe({
      next: res => {
        console.log(res);
        this.loading = false;
        this.bridgeService.getLoading(this.loading);
        this.notification = {
          isFound: true,
          message: res['message'],
          status: 'success'
        };
        this.router.navigate(['/auth/login']);
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);
      },
      error: err => {
        console.error(err);
        this.loading = false;
        this.bridgeService.getLoading(this.loading)
        this.notification = {
          isFound: true,
          message: err.error.errors.email[0] || err.error.message,
          status: 'alert',
        };
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);
      }
    })
  }


}
