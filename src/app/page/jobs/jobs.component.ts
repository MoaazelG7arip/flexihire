import { Component, inject } from '@angular/core';
import { InformationService } from '../../services/information.service';
import { ProgressBarComponent } from "../../shared/progress-bar/progress-bar.component";
import { LoaderComponent } from "../../shared/loader/loader.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { NotificationComponent } from "../../shared/notification/notification.component";
import { DomSanitizer } from '@angular/platform-browser';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [ProgressBarComponent, LoaderComponent, RouterLink, CurrencyPipe, DatePipe, NotificationComponent],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css'
})
export class JobsComponent {

  informationService: InformationService = inject(InformationService);
  jobService: JobService = inject(JobService);
  jobs = [];
  loading = false;
  locationChange = false;
  userLocation;
  list;
  routeSubscription: any;
  notification = {isFound: false, message: '', status: ''};

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  sanitizer = inject(DomSanitizer);

  paginationLinks = [];


  ngOnInit(): void {
    sessionStorage.removeItem('addInfo');

    this.routeSubscription = this.route.queryParamMap.subscribe(queryMap => {
      let page = +queryMap.get('page');
      let search = queryMap.get('search');
      let searchLocation = queryMap.get('searchLocation');
      let minSalary = queryMap.get('minSalary');
      let maxSalary = queryMap.get('maxSalary');
      
      if(page == 0){ page = 1 }
      if(search == null){ search = '' }
      if(searchLocation == null){ searchLocation = '' }
      if(minSalary == null){ minSalary = '' }
      if(maxSalary == null){ maxSalary = '' }

      this.fetchJobsDetails(page, search, searchLocation, minSalary, maxSalary);
    });


    
  }
  
  fetchJobsDetails(page, search, searchLocation, minSalary, maxSalary) {
    
        this.loading = true;
        this.informationService.onGetJobsByUrl(page, search, searchLocation, minSalary, maxSalary).subscribe({
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
        let searchLocation = this.route.snapshot.queryParamMap.get('searchLocation');
        let minSalary = this.route.snapshot.queryParamMap.get('minSalary');
        let maxSalary = this.route.snapshot.queryParamMap.get('maxSalary');
  
        if(pageLabel == 0){ pageLabel = 1 }
        if(search == null){ search = '' }
        if(searchLocation == null){ searchLocation = '' }
        if(minSalary == null){ minSalary = '' }
        if(maxSalary == null){ maxSalary = '' }
  
        if (label == 'Next &raquo;') {
  
          this.router.navigate(['/page/jobs'], { queryParams: { page: ++pageLabel, search: search, searchLocation: searchLocation, minSalary: minSalary, maxSalary: maxSalary } });
  
        } else if( label == '&laquo; Previous') {
  
          this.router.navigate(['/page/jobs'], { queryParams: { page: --pageLabel, search: search, searchLocation: searchLocation, minSalary: minSalary, maxSalary: maxSalary } });
  
        } else {
          this.router.navigate(['/page/jobs'], { queryParams: { page: label, search: search,  searchLocation: searchLocation, minSalary: minSalary, maxSalary: maxSalary } });
        }
      }
  
    }
  
    onSearch(jobName, searchLocation, minSalary, maxSalary) {
      this.router.navigate(['/page/jobs'], { queryParams: { page: 1 , search : jobName.value, searchLocation: searchLocation.value, minSalary: minSalary.value, maxSalary: maxSalary.value }}); 
    }

    getSafeHtml(html: string) {
      return this.sanitizer.bypassSecurityTrustHtml(html);
    }

    saveJob(jobId) {

      this.loading = true;
      this.jobService.onSaveJob(jobId).subscribe({
        next: (res) => {
          console.log(res);
          this.loading = false;


          this.jobs.forEach((job) => {
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
}
