import { Component, inject, Pipe } from '@angular/core';
import { InformationService } from '../../../services/information.service';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { JobService } from '../../../services/job.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationComponent } from "../../../shared/notification/notification.component";
import { LoaderComponent } from "../../../shared/loader/loader.component";



@Component({
  selector: 'app-recommended-jobs',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe, NotificationComponent, LoaderComponent],
  templateUrl: './recommended-jobs.component.html',
  styleUrl: './recommended-jobs.component.css'
})
export class RecommendedJobsComponent {


    recommendedJobs = [];
    user;
    loading = false;
    notification = {isFound: false, message: '', status: ''};
  
  
  
  
    informationService: InformationService = inject(InformationService);
    jobService: JobService = inject(JobService);
    sanitizer = inject(DomSanitizer);
    
    

    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      this.fetchRecommendedJobs();
      this.user = JSON.parse(localStorage.getItem('user'));
    }


    fetchRecommendedJobs() {
    this.loading = true;
    this.informationService.onGetRecommendedJobs().subscribe({
      next: (res: any) => {
        this.loading = false;
        this.recommendedJobs = res['data'];
        console.log('Recommended Jobs:', this.recommendedJobs);
  
      },
      error: (err) => {
        this.loading = false;
        console.error('Error fetching top companies:', err);
  
        this.notification = {
          isFound: true,
          message: err.error.message || 'Error fetching jobs',
          status: 'alert',
        };
        setTimeout(() => {
          this.notification = { isFound: false, message: '', status: '' };
        }, 3500);
      }
    });
  }

  saveJob(jobId) {

  this.loading = true;
  this.jobService.onSaveJob(jobId).subscribe({
    next: (res) => {
      console.log(res);
      this.loading = false;

      this.recommendedJobs.forEach((job) => {
        if (job.id === jobId) {
          job.saved = !job.saved; // Update the job's isSaved property
        }
      });


      this.notification = {
        isFound: true,
        message: res['message'] || 'Job saved successfully',
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
        message: err.error.message || 'Error saving job',
        status: 'alert',
      };
      setTimeout(() => {
        this.notification = { isFound: false, message: '', status: '' };
      }, 3500);
    }
  });
}

    getSafeHtml(html: string) {
      return this.sanitizer.bypassSecurityTrustHtml(html);
    }

}
