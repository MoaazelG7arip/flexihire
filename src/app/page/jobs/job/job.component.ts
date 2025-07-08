import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { InformationService } from '../../../services/information.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoaderComponent } from "../../../shared/loader/loader.component";
import { FormsModule } from '@angular/forms';
import { JobService } from '../../../services/job.service';
import { NotificationComponent } from "../../../shared/notification/notification.component";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-job',
  standalone: true,
  imports: [CommonModule, LoaderComponent, FormsModule, NotificationComponent, RouterLink],
  templateUrl: './job.component.html',
  styleUrl: './job.component.css'
})
export class JobComponent {

  
  loading = false;
  job = null;
  proposal = '';

  sanitizer = inject(DomSanitizer);

  informationService: InformationService = inject(InformationService);
  jobService: JobService = inject(JobService);
  route: ActivatedRoute = inject(ActivatedRoute);
  notification = {isFound: false, message: '', status: ''};
  isApplied = false;
  mainUser;

  ngOnInit(): void {
    this.loading = true;
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.informationService.onGetJobById(id).subscribe({
      next: (res) => {
        console.log(res);
        this.loading = false;
        this.job = res['job'];
        this.isApplied = res['has_applied'];
        this.mainUser = JSON.parse(localStorage.getItem('user'));

        this.notification = {
          isFound: true,
          message: res['message'] || 'Job fetched successfully',
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
          message: err.error.message || 'Job not fetched',
          status: 'alert',
        };
        setTimeout(() => {
          this.notification = { isFound: false, message: '', status: '' };
        }, 3500);
      }
    });
  }

  ApplyForJob(jobId){
    this.loading = true;
    const data = {
      job_id: jobId,
      proposal: this.proposal
    };
    this.jobService.onApplyForJob(data).subscribe({
      next: (res) => {
        this.loading = false;
        console.log(res);

        this.proposal = '';
        this.isApplied = true;

        this.notification = {
          isFound: true, 
          message: res['message'] || "Job Applied Successfully",
          status:'success'
        };
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);
      },
      error: (err) => {
        this.loading = false;
        console.log(err);
        
        this.proposal = '';
        this.notification = {
          isFound: true, 
          message: err.error.message || "Job Application Failed",
          status:'alert'
        };
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);
      }
    });
  }





  getSafeHtml(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

}
