import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InformationService } from '../../services/information.service';
import { NotificationComponent } from "../../shared/notification/notification.component";
import { LoaderComponent } from "../../shared/loader/loader.component";
import { CurrencyPipe } from '@angular/common';
import { JobService } from '../../services/job.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NotificationComponent, LoaderComponent, CurrencyPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  topCompanies = [];
  recommendedJobs = [];
  savedJobs = [];
  loading = false;
  notification = {isFound: false, message: '', status: ''};
  user: any;




  informationService: InformationService = inject(InformationService);
  jobService: JobService = inject(JobService);
  sanitizer = inject(DomSanitizer);


  ngOnInit(): void {

    this.user = JSON.parse(localStorage.getItem('user'));
    
    this.fetchTopCompanies();
    this.fetchRecommendedJobs();
    this.fetchSavedJobs();
    
  }
  
  fetchTopCompanies() {
    this.loading = true;
    this.informationService.onGetTopCompanies().subscribe({
      next: (res: any) => {
        this.loading = false;
        this.topCompanies = res['data'];
  
      },
      error: (err) => {
        this.loading = false;
        console.error('Error fetching top companies:', err);
  
        this.notification = {
          isFound: true,
          message: err.error.message || 'Error fetching applications',
          status: 'alert',
        };
        setTimeout(() => {
          this.notification = { isFound: false, message: '', status: '' };
        }, 3500);
      }
    });
  }

  fetchRecommendedJobs() {
    this.loading = true;
    this.informationService.onGetRecommendedJobs().subscribe({
      next: (res: any) => {
        this.loading = false;
        this.recommendedJobs = res['data'];
  
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

  fetchSavedJobs() {
    this.loading = true;
    this.informationService.onGetSavedJobs().subscribe({
      next: (res: any) => {
        this.loading = false;
        this.savedJobs = res['data']['data'];
  
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


      this.fetchSavedJobs(); // Refresh saved jobs after saving a new one

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
