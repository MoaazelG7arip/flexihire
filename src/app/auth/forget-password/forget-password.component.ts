import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { Router } from '@angular/router';
import { BridgeService } from '../../services/bridge.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {


  loading: boolean = false;
  notification: any = { isFound:false, message:'', status : ''};
  
  forgetForm: FormGroup;
  router: Router = inject(Router);
  bridgeService : BridgeService = inject(BridgeService);
  authService: AuthService = inject(AuthService);

  constructor() {
    this.forgetForm = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
      }
    );
  }
  ngOnInit(): void {

    this.bridgeService.loading.subscribe((status) => {
      this.loading = status;
    });
    // this.bridgeService.notification.subscribe((notification) => {
    //   this.notification = notification;
    // });
    
  }

  
  onSubmit() {
    if (this.forgetForm.valid) {
      // this.bridgeService.getForgetForm(this.forgetForm.value);
      this.onForgetPassword();
    }
  }

  goToLoginPage(){
    this.router.navigate(['/auth/login'])
  }

  onForgetPassword(){
    this.loading = true;
    this.bridgeService.getLoading(this.loading)
    this.authService.onForgetPassword(this.forgetForm.value).subscribe({
      next: res => {
        console.log(res);
        this.loading = false;
        this.bridgeService.getLoading(this.loading)
        sessionStorage.setItem('email', this.forgetForm.value.email);
        this.notification = {
          isFound: true,
          message: res['message'],
          status:'success'
        };
        this.bridgeService.getNotification(this.notification);
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);
        this.bridgeService.getNotification(this.notification);
        this.router.navigate(['/auth/reset-password']);
      },
      error: err => {
        console.error(err);
        this.loading = false;
        this.bridgeService.getLoading(this.loading)
        this.notification = {
          isFound: true,
          message: err?.error?.message,
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
