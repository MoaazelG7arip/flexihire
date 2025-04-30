import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordMatchValidator } from '../../validators/confimPassword.validator';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { NotificationComponent } from "../../shared/notification/notification.component";
import { BridgeService } from '../../services/bridge.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  loading: boolean = false;
  notification: any = { isFound:false, message:'', status : ''};


  email: string = sessionStorage.getItem('email');
  resetForm: FormGroup;
  bridgeService: BridgeService = inject(BridgeService);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  ngOnInit() {

    this.resetForm = new FormGroup(
      {
        email: new FormControl(this.email, [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        password_confirmation: new FormControl('', [Validators.required]),
        token: new FormControl('', [Validators.required, Validators.pattern(/^\d{6}$/)]),
      },{
        validators : PasswordMatchValidator,
      }
    );
    this.bridgeService.loading.subscribe((data) => {
      this.loading = data;
    });
    // this.bridgeService.notification.subscribe((data) => {
    //   this.notification = data;
    // });
  }

  
  onSubmit() {
    if (this.resetForm.valid) {
      // this.bridgeService.getResetForm(this.resetForm.value);
      this.onReset();
    }
  }

  onReset(){
    this.loading = true;
    this.bridgeService.getLoading(this.loading)
    this.authService.onResetPassword(this.resetForm.value).subscribe({
      next: res => {
        console.log(res);
        this.loading = false;
        this.bridgeService.getLoading(this.loading);
        this.notification = {
          isFound: true,
          message: res['message'],
          status: 'success'
        };
        this.bridgeService.getNotification(this.notification);
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);
        this.bridgeService.getNotification(this.notification);
        this.router.navigate(['/auth/login']);
      },
      error: err => {
        console.error(err);
        this.loading = false;
        this.bridgeService.getLoading(this.loading)
        this.notification = {
          isFound: true,
          message: err?.error?.errors?.email[0] || err?.error?.message,
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
