import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NotificationComponent } from '../../../../shared/notification/notification.component';
import { LoaderComponent } from '../../../../shared/loader/loader.component';
import { JobService } from '../../../../services/job.service';
import { AddJobComponent } from "./add-job/add-job.component";
import { EditJobComponent } from "./edit-job/edit-job.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BridgeService } from '../../../../services/bridge.service';

@Component({
  selector: 'app-my-jobs',
  standalone: true,
  imports: [LoaderComponent, NotificationComponent, CommonModule, AddJobComponent, EditJobComponent, RouterLink],
  templateUrl: './my-jobs.component.html',
  styleUrl: './my-jobs.component.css',
})
export class MyJobsComponent {


  myJobs = [];
  jobService: JobService = inject(JobService);
  bridgeService: BridgeService = inject(BridgeService);
  router:Router = inject(Router);
  route:ActivatedRoute = inject(ActivatedRoute);
  loading: boolean = false;
  notification = { isFound: false, message: '', status: '' };
  pageStatus = '';
  jobUpdate;
  paginationLinks = [];
  routeSubscription: any;



  ngOnInit(): void {

    this.routeSubscription = this.route.queryParamMap.subscribe(queryMap => {
      let page = +queryMap.get('page');
      
      if(page == 0){ page = 1 }

      this.fetchMyJobs(page);
    });
  }
  
  
  fetchMyJobs(page) {
    this.loading = true;
    this.jobService.onGetMyJobsByUrl(page).subscribe({
      next: (res) => {
        this.loading = false;
        console.log(res);
        this.myJobs = res['data']['data'];
        this.paginationLinks = res['data']['links'];            

  
        this.notification = {
          isFound: true,
          message: res['message'] || 'Applications fetched successfully',
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
          message: err.error.message || 'Error fetching applications',
          status: 'alert',
        };
        setTimeout(() => {
          this.notification = { isFound: false, message: '', status: '' };
        }, 3500);
      },
    });
  }

  onChangeStatus(status: string) {
    let pageLabel = +this.route.snapshot.queryParamMap.get('page');

    this.pageStatus = status;
    if(this.pageStatus == 'done'){
      this.fetchMyJobs(pageLabel);
    }
    this.jobUpdate = null;
  }

  onupdateJob(job: any) {
    this.pageStatus = 'edit';
    this.jobUpdate = job;
  }

  onDeleteJob(id: number) {
    let pageLabel = +this.route.snapshot.queryParamMap.get('page');

    this.loading = true;
    this.jobService.onDeleteJob(id).subscribe({
      next: (res) => {
        this.loading = false;
        console.log(res);
        this.fetchMyJobs(pageLabel);
  
        this.notification = {
          isFound: true,
          message: res['message'] || 'Job deleted successfully',
          status: 'success',
        };
        setTimeout(() => {
          this.notification = { isFound: false, message: '', status: '' };
        }, 3500);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error deleting job:', err);
  
        this.notification = {
          isFound: true,
          message: err.error.message || 'Job not deleted successfully',
          status: 'alert',
        };
        setTimeout(() => {
          this.notification = { isFound: false, message: '', status: '' };
        }, 3500);
      },
    });
  }




  goToPage(label, url){

    if(url != null){
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
      let pageLabel = +this.route.snapshot.queryParamMap.get('page');

      if(pageLabel == 0 || pageLabel == null || pageLabel == undefined){ pageLabel = 1 }

      if (label == 'Next &raquo;') {

        this.router.navigate([], {relativeTo: this.route, queryParams: { page: ++pageLabel } });

      } else if( label == '&laquo; Previous') {

        this.router.navigate([], {relativeTo: this.route, queryParams: { page: --pageLabel } });

      } else {
        this.router.navigate([], {relativeTo: this.route, queryParams: { page: label } });
      }
    }

  }
}
