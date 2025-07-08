import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { NotificationComponent } from "../../shared/notification/notification.component";
import { BridgeService } from '../../services/bridge.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  bridgeService: BridgeService = inject(BridgeService);
  authService: AuthService = inject(AuthService);
  loading: boolean = false;
  notification: any = { isFound:false, message:'', status : ''};
  
  seePassword:boolean = false;

  router: Router = inject(Router);


  loginForm: FormGroup;

  constructor() {
    this.loginForm = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      }
    );
  }

  ngOnInit(): void {
    
    this.bridgeService.loading.subscribe((data)=>{
      this.loading = data;
    })
    // this.bridgeService.notification.subscribe((data)=>{
    //   this.notification = data;
    // })
    
  }

  
  onSubmit() {
    if (this.loginForm.valid) {
      // this.logForm.emit(this.loginForm.value)
      // this.bridgeService.getLogForm(this.loginForm.value);
      this.onLogin();
    }
  }  
  goToRegisterPage(){
    this.router.navigate(['/auth/register'])
  }
  goToForgetPassword(){
    this.router.navigate(['/auth/forget-password'])
  }

  onLogin(){
    this.loading = true;
    this.bridgeService.getLoading(this.loading)
    console.log('login Form  : ' , this.loginForm.value);
    this.authService.onLogin(this.loginForm.value).subscribe({
      next: res => {
        console.log(res);
        this.loading = false;
        this.bridgeService.getLoading(this.loading);
        this.authService.user.next(res);
        localStorage.setItem('user', JSON.stringify(res));
        // routing to home page
        this.router.navigate(['/page/home']);
        // end
        this.notification = {
          isFound: true,
          message: res['message'] || 'Login Successfully',
          status:'success'
        };
        this.bridgeService.getNotification(this.notification);
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);
        this.bridgeService.getNotification(this.notification);
      },
      error: err => {
        console.error(err);
        this.loading = false;
        this.bridgeService.getLoading(this.loading)
        this.notification = {
          isFound: true,
          message: err?.error?.message || 'Login Failed',
          status: 'alert',
        };
        this.bridgeService.getNotification(this.notification);
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);
        this.bridgeService.getNotification(this.notification);
      }
    })
  }


}
