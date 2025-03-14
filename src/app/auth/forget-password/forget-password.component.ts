import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { NotificationComponent } from "../../shared/notification/notification.component";
import { Router } from '@angular/router';
import { BridgeService } from '../../services/bridge.service';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, ],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {


  loading: boolean = false;
  // notification: any = { isFound:false, message:'', status : ''};
  
  forgetForm: FormGroup;
  router: Router = inject(Router);
  bridgeService : BridgeService = inject(BridgeService);

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
      this.bridgeService.getForgetForm(this.forgetForm.value);
    }
  }

  goToLoginPage(){
    this.router.navigate(['/auth/login'])
  }
}
