import { Component, inject } from '@angular/core';
import { JobService } from '../../../../services/job.service';
import { NotificationComponent } from "../../../../shared/notification/notification.component";
import { LoaderComponent } from "../../../../shared/loader/loader.component";
import { CommonModule, NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-my-reviews',
  standalone: true,
  imports: [NotificationComponent, LoaderComponent, CommonModule],
  templateUrl: './my-reviews.component.html',
  styleUrl: './my-reviews.component.css'
})
export class MyReviewsComponent {

  
  
  reviews = null;
  loading: boolean = false;
  notification = {isFound: false, message: '', status: ''};
  paginationLinks = [];

  
  jobService: JobService = inject(JobService);
  router:Router = inject(Router);
  route:ActivatedRoute = inject(ActivatedRoute);
    
  
    ngOnInit(): void {
      
      this.loading = true;
      this.jobService.onGetReviews().subscribe({
        next: (res) => {
          this.loading = false;
          console.log(res);
          this.reviews = res['data']['data'];
          this.paginationLinks = res['data']['links'];            
  
  
          this.notification = {
            isFound: true, 
            message: res['message'] || "Reviews fetched successfully",
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
            message: err.error.message || "Error fetching reviews",
            status:'alert'
          };
          setTimeout(() => {
            this.notification = {isFound: false, message: '', status: ''};
          }, 3500);
  
        }
      })
      
    }
  
    onDeleteReview(reviewId: number) {
      this.loading = true;
      this.jobService.onDeleteReview(reviewId).subscribe({
        next: (res) => {
          this.loading = false;
          console.log(res);
          this.reviews = this.reviews.filter(review => review.id !== reviewId);
  
          this.notification = {
            isFound: true, 
            message: res['message'] || "Review deleted successfully",
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
            message: err.error.message || "Error deleting review",
            status:'alert'
          };
          setTimeout(() => {
            this.notification = {isFound: false, message: '', status: ''};
          }, 3500);
  
        }
      })
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
