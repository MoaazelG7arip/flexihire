import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InformationService } from '../../services/information.service';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { NotificationComponent } from "../../shared/notification/notification.component";

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, NotificationComponent],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {

  loading = false;
  notification = { isFound: false, message: '', status: '' };

  contactForm: FormGroup;

  informationService: InformationService = inject(InformationService);

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      // name: ['', [Validators.required, Validators.minLength(3)]],
      // email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {

      this.loading = true;
      this.informationService.onContactUs(this.contactForm.value).subscribe({
        next: (res) => {
          this.loading = false;
          console.log(res);          


          this.notification = {
            isFound: true,
            message: res['message'] || 'Message Sent successfully',
            status: 'success',
          };
          setTimeout(() => {
            this.notification = { isFound: false, message: '', status: '' };
          }, 3500);
        },
        error: (err) => {
          this.loading = false;
          console.log(err);

          this.notification = {
            isFound: true,
            message: err.error.message || 'Can not Sending Message',
            status: 'alert',
          };
          setTimeout(() => {
            this.notification = { isFound: false, message: '', status: '' };
          }, 3500);
        }
      })
    
      
      this.contactForm.reset();
    } else {
      console.log('Form is invalid');
    }
  }
}
