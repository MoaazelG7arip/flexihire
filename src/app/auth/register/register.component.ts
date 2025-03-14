import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordMatchValidator } from '../../validators/confimPassword.validator';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { NotificationComponent } from "../../shared/notification/notification.component";
import { BridgeService } from '../../services/bridge.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  loading: boolean = false;
  // notification: any = { isFound:false, message:'', status : ''};

  registrationForm: FormGroup;
  bridgeService: BridgeService = inject(BridgeService);
  router: Router = inject(Router);

  constructor() {
    this.registrationForm = new FormGroup(
      {
        first_name: new FormControl('', [Validators.required]),
        last_name: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        password_confirmation: new FormControl('', [Validators.required, Validators.minLength(8)]),
        role: new FormControl('', [Validators.required]),
      },{
        validators : PasswordMatchValidator,
      }
    );
  }

  ngOnInit(): void {
    this.bridgeService.loading.subscribe((data)=>{
      this.loading = data;
    });
  }

  
  onSubmit() {
    if (this.registrationForm.valid) {
      this.bridgeService.getRegisterForm(this.registrationForm.value);
    }
  }

  goToLoginPage(){
    this.router.navigate(['/auth/login']);
  }
}
