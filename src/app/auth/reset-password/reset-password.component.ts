import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordMatchValidator } from '../../validators/confimPassword.validator';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { NotificationComponent } from "../../shared/notification/notification.component";
import { BridgeService } from '../../services/bridge.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  loading: boolean = false;
  // notification: any = { isFound:false, message:'', status : ''};


  email: string = sessionStorage.getItem('email');
  resetForm: FormGroup;
  bridgeService: BridgeService = inject(BridgeService);

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
      this.bridgeService.getResetForm(this.resetForm.value);
    }
  }
}
