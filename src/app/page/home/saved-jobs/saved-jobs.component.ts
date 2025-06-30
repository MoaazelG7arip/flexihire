import { Component, inject } from '@angular/core';
import { InformationService } from '../../../services/information.service';
import { JobService } from '../../../services/job.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationComponent } from "../../../shared/notification/notification.component";
import { LoaderComponent } from "../../../shared/loader/loader.component";

@Component({
  selector: 'app-saved-jobs',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink, NotificationComponent, LoaderComponent],
  templateUrl: './saved-jobs.component.html',
  styleUrl: './saved-jobs.component.css',
})
export class SavedJobsComponent {

  savedJobs = [];
  user;
  loading = false;
  notification = { isFound: false, message: '', status: '' };

  informationService: InformationService = inject(InformationService);
  jobService: JobService = inject(JobService);
  sanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.fetchSavedJobs();
    this.user = JSON.parse(localStorage.getItem('user'));
  }

 fetchSavedJobs() {
    this.loading = true;
    this.informationService.onGetSavedJobs().subscribe({
      next: (res: any) => {
        this.loading = false;
        this.savedJobs = res['data']['data'];
        console.log('Saved Jobs:', this.savedJobs);
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

        this.fetchSavedJobs(); // Refresh the saved jobs list

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
      },
    });
  }

  getSafeHtml(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
