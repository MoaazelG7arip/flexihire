import { Component, inject } from '@angular/core';
import { JobService } from '../../../../services/job.service';
import { LoaderComponent } from "../../../../shared/loader/loader.component";
import { NotificationComponent } from "../../../../shared/notification/notification.component";
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-my-jobs',
  standalone: true,
  imports: [LoaderComponent, NotificationComponent, CommonModule],
  templateUrl: './my-jobs.component.html',
  styleUrl: './my-jobs.component.css'
})
export class MyJobsComponent {

  jobService: JobService = inject(JobService);
  
  
  myJobs = [];
  loading: boolean = false;
  notification = {isFound: false, message: '', status: ''};

  ngOnInit(): void {
    
    this.loading = true;
    this.jobService.onGetMyApplications().subscribe({
      next: (res) => {
        this.loading = false;
        console.log(res);
        this.myJobs = res['data'];


        this.notification = {
          isFound: true, 
          message: res['message'] || "Applications fetched successfully",
          status:'success'
        };
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);

      },
      error: (err) => {
        this.loading = false;
        console.log(err);

        this.notification = {
          isFound: true, 
          message: err.error.message || "Error fetching applications",
          status:'alert'
        };
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);

      }
    })
    
  }



  


}
