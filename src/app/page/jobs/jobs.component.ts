import { Component, inject } from '@angular/core';
import { InformationService } from '../../services/information.service';
import { ProgressBarComponent } from "../../shared/progress-bar/progress-bar.component";
import { LoaderComponent } from "../../shared/loader/loader.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { NotificationComponent } from "../../shared/notification/notification.component";

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [ProgressBarComponent, LoaderComponent, RouterLink, CurrencyPipe, DatePipe, NotificationComponent],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css'
})
export class JobsComponent {

  informationService: InformationService = inject(InformationService);
  jobs = [];
  loading = false;
  locationChange = false;
  userLocation;
  list;
  routeSubscription: any;
  notification = {isFound: false, message: '', status: ''};

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  paginationLinks = [];


  ngOnInit(): void {

    this.routeSubscription = this.route.queryParamMap.subscribe(queryMap => {
      let page = +queryMap.get('page');
      let search = queryMap.get('search');
      
      if(page == 0){ page = 1 }
      if(search == null){ search = '' }

      this.fetchJobsDetails(page, search);
    });


    
  }
  
  fetchJobsDetails(page, search){
    
        this.loading = true;
        this.informationService.onGetJobsByUrl(page, search).subscribe({
          next: (res) => {
            console.log(res);
            this.loading = false;
            this.jobs = res['data']['data'];
            this.paginationLinks = res['data']['links'];            

            
            // this.userLocation = JSON.parse(localStorage.getItem('user')).user.location;
            // console.log(this.userLocation);

            this.notification = {
              isFound: true,
              message: res['message'] || 'Jobs fetched successfully',
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
              message: err.error.message || 'Error fetching jobs',
              status: 'alert',
            };
            setTimeout(() => {
              this.notification = { isFound: false, message: '', status: '' };
            }, 3500);
          }
        });

  }



  
  // onLocationChange(){
  //   console.log('Location changed');
  //   this.locationChange = !this.locationChange;
  //   if(this.locationChange){
  //     let filteredJobs = [];
  //     this.jobs.forEach((company)=>{
  //       if(company.location == this.userLocation){
  //         filteredJobs.push(company);
  //       }
  //     })
  //     // this.paginateJobs(filteredJobs);
  //     // this.goToPage(0);
  //   } else {
  //     // this.paginateJobs(this.jobs);
  //     // this.goToPage(0);
  //   }
  // }




    goToPage(label, url){

      if(url != null){
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
        let pageLabel = +this.route.snapshot.queryParamMap.get('page');
        let search = this.route.snapshot.queryParamMap.get('search');
  
        if(pageLabel == 0){ pageLabel = 1 }
        if(search == null){ search = '' }
  
        if (label == 'Next &raquo;') {
  
          this.router.navigate(['/page/jobs'], { queryParams: { page: ++pageLabel, search: search } });
  
        } else if( label == '&laquo; Previous') {
  
          this.router.navigate(['/page/jobs'], { queryParams: { page: --pageLabel, search: search } });
  
        } else {
          this.router.navigate(['/page/jobs'], { queryParams: { page: label, search: search } });
        }
      }
  
    }
  
    onSearch(event: any) {
  
      this.router.navigate(['/page/jobs'], { queryParams: { page: 1 , search : event.value} }); 
  
    }
}
