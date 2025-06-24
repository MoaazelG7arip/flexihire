import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../../../../services/job.service';
import { NotificationComponent } from "../../../../shared/notification/notification.component";
import { LoaderComponent } from "../../../../shared/loader/loader.component";

@Component({
  selector: 'app-rate-us',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NotificationComponent, LoaderComponent],
  templateUrl: './rate-us.component.html',
  styleUrl: './rate-us.component.css'
})
export class RateUsComponent {


  reviewForm: FormGroup;
  selectedRating = 0;
  hoverRating = 0;

  loading = false;
  notification = { isFound: false, message: '', status: '' };

  @Output() reviewSubmitted : EventEmitter<boolean> = new EventEmitter();
    

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  jobService: JobService = inject(JobService);

  constructor(private fb: FormBuilder) {
    this.reviewForm = this.fb.group({
      comment: ['', [Validators.required]]
    });
  }

  rate(rating: number): void {
    this.selectedRating = rating;
  }

  setHoverRating(rating: number): void {
    this.hoverRating = rating;
  }

  clearHoverRating(): void {
    this.hoverRating = 0;
  }

  getStarClass(index: number): string {
    const baseClasses = 'text-2xl cursor-pointer border rounded w-12 h-12 flex justify-center items-center transition-all duration-200';
    
    if (this.hoverRating >= index) {
      return `${baseClasses} text-yellow-400 border-yellow-400`;
    }
    if (this.selectedRating >= index) {
      return `${baseClasses} text-yellow-400 border-yellow-400`;
    }
    return `${baseClasses} text-gray-300 border-gray-300`;
  }

  onSubmit(): void {
    if (this.reviewForm.invalid || this.selectedRating === 0) {
      return;
    }

    let review;
    review ={
      company_id: this.route.snapshot.params['id'],
      rating: this.selectedRating,
      comment: this.reviewForm.value.comment
    };

    
    this.loading = true;
    this.jobService.onReviewCompany(review).subscribe({
        next: (res) => {
          this.loading = false;
        
          this.notification = {
            isFound: true,
            message: res['message'] || 'Company reviewed successfully',
            status: 'success',
          };
          this.reviewSubmitted.emit(false);

        setTimeout(() => {
          this.notification = { isFound: false, message: '', status: '' };
        }, 3500);
      },
      error: (err) => {
        this.loading = false;
        console.log(err);

        this.reviewForm.reset();

        this.notification = {
          isFound: true,
          message: err.error.message || 'Company not reviewed',
          status: 'alert',
        };
        setTimeout(() => {
          this.notification = { isFound: false, message: '', status: '' };
        }, 3500);
      }
    });      

    


  }
  
  close(){
    this.reviewSubmitted.emit(false);
  }
  
  
}
