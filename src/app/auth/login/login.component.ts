import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { NotificationComponent } from "../../shared/notification/notification.component";
import { BridgeService } from '../../services/bridge.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  bridgeService: BridgeService = inject(BridgeService);
  loading: boolean = false;
  // notification: any = { isFound:false, message:'', status : ''};

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
      this.bridgeService.getLogForm(this.loginForm.value);
    }
  }  
  goToRegisterPage(){
    // this.authStatus.emit('register')
    this.router.navigate(['/auth/register'])
  }
  goToForgetPassword(){
    // this.authStatus.emit('forget')
    this.router.navigate(['/auth/forget-password'])
  }
}
