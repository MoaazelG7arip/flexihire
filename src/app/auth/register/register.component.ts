import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordMatchValidator } from '../../validators/confimPassword.validator';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { NotificationComponent } from "../../shared/notification/notification.component";
import { BridgeService } from '../../services/bridge.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  loading: boolean = false;
  notification: any = { isFound:false, message:'', status : ''};

  registrationForm: FormGroup;
  bridgeService: BridgeService = inject(BridgeService);
  authService: AuthService = inject(AuthService);
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

  
  // onSubmit() {
  //   if (this.registrationForm.valid) {
  //     this.bridgeService.getRegisterForm(this.registrationForm.value);
  //   }
  // }
  onSubmit() {
    if (this.registrationForm.valid) {
      this.onRegisteration();
    }
  }

  goToLoginPage(){
    this.router.navigate(['/auth/login']);
  }

  onRegisteration(){
    this.loading = true;
    this.bridgeService.getLoading(this.loading)
    this.authService.onRegister(this.registrationForm.value).subscribe({
      next: res => {
        console.log(res);
        this.loading = false;
        this.bridgeService.getLoading(this.loading)
        this.authService.user.next(res);
        localStorage.setItem('user', JSON.stringify(res));
        sessionStorage.setItem('addInfo', 'true');
        // routing to home page
        // end
        this.notification = {
          isFound: true,
          message: res['message'] || "Registration Successfully",
          status:'success'
        };
        this.bridgeService.getNotification(this.notification);
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);
        this.bridgeService.getNotification(this.notification);
        this.router.navigate(['/page/account']);
      },
      error: err => {
        console.error(err);
        this.loading = false;
        this.notification = {
          isFound: true,
          message: err?.error?.errors?.email[0] || err?.error?.message,
          status: 'alert'
        };
        this.bridgeService.getNotification(this.notification);
        this.bridgeService.getLoading(this.loading)
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);
        this.bridgeService.getNotification(this.notification);
      }
    })
  }
}
