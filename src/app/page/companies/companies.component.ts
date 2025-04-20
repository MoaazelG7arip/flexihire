import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ProgressBarComponent } from "../../shared/progress-bar/progress-bar.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  paginationLinks= [];
  loading = false;
  locationChange = false;
  userLocation;
  list;
  routeSubscription: any;


  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);


  ngOnInit(): void {

    this.routeSubscription = this.route.queryParamMap.subscribe(queryMap => {
      let page = +queryMap.get('page');
      console.log(page);
      if(page == 0){ page = 1 }
      console.log(page);
      this.fetchCompanyDetails(page);
    });




  }

  fetchCompanyDetails(page){
    this.loading = true;
    this.informationService.onGetCompanyByUrl(page).subscribe({
      next: (res) => {
        this.loading = false;
        console.log(res);
        this.companies = res['data']['data'];
        this.paginationLinks = res['data']['links'];
        // this.paginateCompanies(this.companies);

 
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

    } else {

    }
  }



  goToPage(label, url){

    if(url != null){
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
      let pageLabel = +this.route.snapshot.queryParamMap.get('page');
      if(pageLabel == 0){ pageLabel = 1 }

      if (label == 'Next &raquo;') {

        this.router.navigate(['/page/companies'], { queryParams: { page: ++pageLabel } });

      } else if( label == '&laquo; Previous') {

        this.router.navigate(['/page/companies'], { queryParams: { page: --pageLabel } });

      } else {
        this.router.navigate(['/page/companies'], { queryParams: { page: label } });
      }
    }

  }


}
