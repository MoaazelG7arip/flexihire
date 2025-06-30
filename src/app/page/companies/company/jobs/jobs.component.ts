import { Component, inject } from '@angular/core';
import { InformationService } from '../../../../services/information.service';
import { JobService } from '../../../../services/job.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationComponent } from "../../../../shared/notification/notification.component";
import { LoaderComponent } from "../../../../shared/loader/loader.component";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [NotificationComponent, LoaderComponent, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css'
})
export class JobsComponent {

  
    myJobs = [];
    user
    loading = false;
    notification = { isFound: false, message: '', status: '' };
    routeSubscription: any;
  
    informationService: InformationService = inject(InformationService);
    jobService: JobService = inject(JobService);
    sanitizer = inject(DomSanitizer);
    route:ActivatedRoute = inject(ActivatedRoute);
  

    ngOnInit(): void {
    // Subscribe to paramMap to react to changes in the URL
    this.routeSubscription = this.route.paramMap.subscribe(paramMap => {
      const id = +paramMap.get('id')!;
      this.fetchCompanyDetails(id);
    });
    this.user = JSON.parse(localStorage.getItem('user'));
    }


  fetchCompanyDetails(id: number): void {
    this.loading = true;
    this.informationService.onGetCompanyById(id).subscribe({
      next: (res) => {
        this.loading = false;
        console.log(res);
        this.myJobs = res['company']['jobs'];

        this.notification = {
          isFound: true,
          message: res['message'] || 'Companies fetched successfully',
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
          message: err.error.message || 'Companies not fetched ',
          status: 'alert',
        };
        setTimeout(() => {
          this.notification = { isFound: false, message: '', status: '' };
        }, 3500);
      }
    });
  }

    ngOnDestroy(): void {
    // Unsubscribe from the route paramMap observable to prevent memory leaks
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  
    saveJob(jobId) {
      this.loading = true;
      this.jobService.onSaveJob(jobId).subscribe({
        next: (res) => {
          console.log(res);
          this.loading = false;
  
  
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
