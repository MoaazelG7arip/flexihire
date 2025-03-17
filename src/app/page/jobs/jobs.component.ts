import { Component, inject } from '@angular/core';
import { InformationService } from '../../services/information.service';
import { ProgressBarComponent } from "../../shared/progress-bar/progress-bar.component";
import { LoaderComponent } from "../../shared/loader/loader.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [ProgressBarComponent, LoaderComponent, RouterLink],
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

  paginatedJobs: any[][] = []; // Array of arrays for paginated jobs
  currentPage = 0; // Current page index
  itemsPerPage = 10; // Number of jobs per page

  ngOnInit(): void {
    this.loading = true;
    this.informationService.onGetJobs().subscribe({
      next: (res) => {
        console.log(res);
        this.loading = false;
        this.jobs = res['jobs'];
        this.paginateJobs(this.jobs);

        this.userLocation = JSON.parse(sessionStorage.getItem('user')).user.location;
        console.log(this.userLocation);

      },
      error: (err) => {
        this.loading = false;
        console.log(err);
      }
    });
    
  }


  
  onLocationChange(){
    console.log('Location changed');
    this.locationChange = !this.locationChange;
    if(this.locationChange){
      let filteredJobs = [];
      this.jobs.forEach((company)=>{
        if(company.location == this.userLocation){
          filteredJobs.push(company);
        }
      })
      this.paginateJobs(filteredJobs);
      this.goToPage(0);
    } else {
      this.paginateJobs(this.jobs);
      this.goToPage(0);
    }
  }



    // Split jobs into chunks of 10
    paginateJobs(jobs): void {
      this.paginatedJobs = []; // Clear the existing paginated jobs array
      for (let i = 0; i < jobs.length; i += this.itemsPerPage) {
        this.paginatedJobs.push(jobs.slice(i, i + this.itemsPerPage));
      }
    }
  
    // Navigate to the next page
    nextPage(): void {
      if (this.currentPage < this.paginatedJobs.length - 1) {
        this.currentPage++;
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
      }
    }
  
    // Navigate to the previous page
    previousPage(): void {
      if (this.currentPage > 0) {
        this.currentPage--;
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
      }
    }

    goToPage(page: number): void {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
    }
}
