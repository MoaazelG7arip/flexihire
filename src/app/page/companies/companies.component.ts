import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ProgressBarComponent } from "../../shared/progress-bar/progress-bar.component";
import { RouterLink } from '@angular/router';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { InformationService } from '../../services/information.service';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, ProgressBarComponent, RouterLink, LoaderComponent],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css'
})
export class CompaniesComponent {

  informationService: InformationService = inject(InformationService);
  companies = [];
  loading = false;
  locationChange = false;
  userLocation;
  list;

  paginatedCompanies: any[][] = []; // Array of arrays for paginated jobs
  currentPage = 0; // Current page index
  itemsPerPage = 10; // Number of jobs per page

  ngOnInit(): void {
    this.loading = true;
    this.informationService.onGetcompanies().subscribe({
      next: (res) => {
        this.loading = false;
        console.log(res);
        this.companies = res['data'];
        this.paginateCompanies(this.companies);

 
        this.userLocation = JSON.parse(sessionStorage.getItem('user')).user.location;
        console.log(this.userLocation);
        // this.list = 0;
        // this.companies.forEach(company =>{
        //   if(company.location == this.userLocation){
        //     this.list++;
        //     console.log('done')
        //   }
        // })
        // console.log(this.list)
      },
      error: (error) => {
        this.loading = false;
        console.log(error);
      }
    })


  }

  onLocationChange(){
    console.log('Location changed');
    this.locationChange = !this.locationChange;
    if(this.locationChange){
      let filteredCompanies = [];
      this.companies.forEach((company)=>{
        if(company.location == this.userLocation){
          filteredCompanies.push(company);
        }
      })
      this.paginateCompanies(filteredCompanies);
      this.goToPage(0);
    } else {
      this.paginateCompanies(this.companies);
      this.goToPage(0);
    }
  }


  paginateCompanies(companies): void {
    this.paginatedCompanies = [];
    for (let i = 0; i < companies.length; i += this.itemsPerPage) {
      this.paginatedCompanies.push(companies.slice(i, i + this.itemsPerPage));
    }
  }

  // Navigate to the next page
  nextPage(): void {
    if (this.currentPage < this.paginatedCompanies.length - 1) {
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
