import { Component, inject } from '@angular/core';
import { BridgeService } from '../../../../../services/bridge.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationComponent } from "../../../../../shared/notification/notification.component";
import { LoaderComponent } from "../../../../../shared/loader/loader.component";
import { JobService } from '../../../../../services/job.service';
import { CommonModule } from '@angular/common';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-applicants',
  standalone: true,
  imports: [NotificationComponent, LoaderComponent, CommonModule],
  templateUrl: './applicants.component.html',
  styleUrl: './applicants.component.css'
})
export class ApplicantsComponent {


  jobId: any;
  applicants = [];
  jobService: JobService = inject(JobService);
  loading: boolean = false;
  notification = {isFound: false, message: '', status: ''};
  router:Router = inject(Router);
  route:ActivatedRoute = inject(ActivatedRoute);
  routeSubscription: any;
  paginationLinks: any;
  aiRank: string = 'false';


  ngOnInit(): void {
    
    this.route.params.subscribe((params) => {

      
      combineLatest([
        this.route.params,
        this.route.queryParamMap
      ]).subscribe(([params, queryMap]) => {
        this.jobId = params['jobId'];
        console.log(this.jobId);
    
        let page = +queryMap.get('page');
        if (page == 0 || page == null || page == undefined) {
          page = 1;
        }

        let rank = queryMap.get('aiRank');
        if(rank == 'true'){
          this.aiRank = rank;
        }

        console.log(this.jobId,page)

        if(this.aiRank == 'false'){
          this.fetchMyApplicants(this.jobId,page);
        } else if(this.aiRank == 'true'){
          this.onAiRanking(this.jobId,page)
        }
      });
    
    
    });


  }

  fetchMyApplicants(jobId,page){
    this.loading = true;
    this.jobService.onShowJobApplicantsByUrl(jobId, page).subscribe({
      next: (res) => {
        this.loading = false;
        console.log(res);
        this.applicants = res['data']['data'];
        this.paginationLinks = res['data']['links'];          


        this.notification = {
          isFound: true, 
          message: res['message'] || "Applicants fetched successfully",
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
          message: err.error.message || "Error fetching applicants",
          status:'alert'
        };
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);

      }
    })
  }

  updateProposalStatus(id, status){
    this.loading = true;
    this.jobService.onUpdateProposalStatus(id, status).subscribe({
      next: (res) => {
        this.loading = false;
        console.log(res);
        this.fetchMyApplicants(this.jobId,1); // Refresh the applicants list

        this.notification = {
          isFound: true,
          message: res['message'] || "Proposal status updated successfully",
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
          message: err.error.message || "Error updating proposal status",
          status:'alert'
        };
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);

      }
    })
  }



  goToPage(label, url){

    if(url != null && this.aiRank == 'false'){
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
    
    
    
    else if (url != null && this.aiRank == 'true') {
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
      let pageLabel = +this.route.snapshot.queryParamMap.get('page');

      if(pageLabel == 0 || pageLabel == null || pageLabel == undefined){ pageLabel = 1 }

      if (label == 'Next &raquo;') {
        this.router.navigate([], {relativeTo: this.route, queryParams: { page: ++pageLabel , aiRank: 'true'} });
      } else if( label == '&laquo; Previous') {
        this.router.navigate([], {relativeTo: this.route, queryParams: { page: --pageLabel , aiRank: 'true'} });
      } else {
        this.router.navigate([], {relativeTo: this.route, queryParams: { page: label , aiRank: 'true'} });
      }
    }

  }


    contactWith(user){
      sessionStorage.setItem('userChat', JSON.stringify(user));
      sessionStorage.setItem('chatType', 'user');
      sessionStorage.setItem('chatMobileChange', 'true')
      this.router.navigate(['/page/real-chat']);
  }


  onAiRanking(jobId, page){

    this.loading = true;
    this.jobService.onRankJobs(jobId, page).subscribe({
      next: (res) => {
        this.loading = false;
        console.log(res);
        // this.fetchMyApplicants(this.jobId,1); // Refresh the applicants list

        this.applicants = res['data']['data'];
        this.paginationLinks = res['data']['links'];
        this.aiRank = 'true';

        console.log(this.applicants)
        


        this.notification = {
          isFound: true,
          message: res['message'] || "Proposal ranking updated successfully",
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
          message: err.error.message || "Error updating proposal ranking",
          status:'alert'
        };
        setTimeout(() => {
          this.notification = {isFound: false, message: '', status: ''};
        }, 3500);

      }
    })
  }
}
