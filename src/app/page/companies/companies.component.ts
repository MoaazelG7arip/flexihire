import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ProgressBarComponent } from "../../shared/progress-bar/progress-bar.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { InformationService } from '../../services/information.service';
import { NotificationComponent } from "../../shared/notification/notification.component";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, ProgressBarComponent, RouterLink, LoaderComponent, NotificationComponent],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css'
})
export class CompaniesComponent {

  informationService: InformationService = inject(InformationService);
  companies = [];
  paginationLinks= [];
  loading = false;
  locationChange = false;
  userLocation;
  list;
  routeSubscription: any;
  notification = {isFound: false, message: '', status: ''};




  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  mainCompany: any;


  ngOnInit(): void {
    sessionStorage.removeItem('addInfo');


    this.routeSubscription = this.route.queryParamMap.subscribe(queryMap => {
      let page = +queryMap.get('page');
      let search = queryMap.get('search');
      let searchLocation = queryMap.get('searchLocation');

      
      if(page == 0){ page = 1 }
      if(search == null){ search = '' }
      if(searchLocation == null){ searchLocation = '' }

      
      this.fetchCompanyDetails(page, search, searchLocation);
    });




  }

  fetchCompanyDetails(page, search, searchLocation){
    this.loading = true;

    this.informationService.onGetCompanyByUrl(page, search, searchLocation).subscribe({
      next: (res) => {
        this.loading = false;
        console.log(res);
        this.companies = res['data']['data'];
        this.paginationLinks = res['data']['links'];

        this.notification = {
          isFound: true,
          message: res['message'] || 'Companies fetched successfully',
          status: 'success',
        };
        setTimeout(() => {
          this.notification = { isFound: false, message: '', status: '' };
        }, 3500);

 
        this.mainCompany = JSON.parse(localStorage.getItem('user'));

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

      }
    }) 

  }
  

  // onLocationChange(){
  //   console.log('Location changed');
  //   this.locationChange = !this.locationChange;
  //   if(this.locationChange){
  //     let filteredCompanies = [];
  //     this.companies.forEach((company)=>{
  //       if(company.location == this.userLocation){
  //         filteredCompanies.push(company);
  //       }
  //     })

  //   } else {

  //   }
  // }



  goToPage(label, url){

    if(url != null){
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
      let pageLabel = +this.route.snapshot.queryParamMap.get('page');
      let search = this.route.snapshot.queryParamMap.get('search');
      let searchLocation = this.route.snapshot.queryParamMap.get('searchLocation');


      if(pageLabel == 0){ pageLabel = 1 }
      if(search == null){ search = '' }
      if(searchLocation == null){ searchLocation = '' }


      if (label == 'Next &raquo;') {

        this.router.navigate(['/page/companies'], { queryParams: { page: ++pageLabel, search: search,searchLocation: searchLocation } });

      } else if( label == '&laquo; Previous') {

        this.router.navigate(['/page/companies'], { queryParams: { page: --pageLabel, search: search, searchLocation: searchLocation } });

      } else {
        this.router.navigate(['/page/companies'], { queryParams: { page: label, search: search, searchLocation: searchLocation } });
      }
    }

  }

  onSearch(companyName, searchLocation) {

    this.router.navigate(['/page/companies'], { queryParams: { page: 1 , search : companyName.value, searchLocation : searchLocation.value} }); 

  }

  onContactMe(event: Event, company: any){
    event.stopPropagation();
    sessionStorage.setItem('userChat', JSON.stringify(company));
    sessionStorage.setItem('chatType', 'company');
    sessionStorage.setItem('chatMobileChange', 'true')
    this.router.navigate(['/page/real-chat']);
  }


}


