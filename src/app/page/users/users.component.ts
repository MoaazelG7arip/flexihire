import { Component, inject } from '@angular/core';
import { ProgressBarComponent } from "../../shared/progress-bar/progress-bar.component";
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { InformationService } from '../../services/information.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ProgressBarComponent, RouterLink, LoaderComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {


  informationService: InformationService = inject(InformationService);
  users = [];
  loading: boolean = false;

  
  route : ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  routeSubscription: any;
  paginationLinks = [];
  
    ngOnInit(): void {

      this.routeSubscription = this.route.queryParamMap.subscribe(queryMap => {
        let page = +queryMap.get('page');
        if(page == 0){ page = 1 }
        console.log(page);
        this.fetchUsersDetails(page);
      });


      
    }
    
    fetchUsersDetails(page){
      this.loading = true;
      this.informationService.onGetUsersByUrl(page).subscribe({
        next: (res) => {
          this.loading = false;
          console.log(res);
          this.users = res['data']['data'];
          this.paginationLinks = res['data']['links'];          
          // this.paginateUsers();
        },
        error: (error) => {
          this.loading = false;
          console.log(error);
        }
      })
    
    }




    goToPage(label, url){

      if(url != null){
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
        let pageLabel = +this.route.snapshot.queryParamMap.get('page');
        if(pageLabel == 0){ pageLabel = 1 }

        if (label == 'Next &raquo;') {
  
          this.router.navigate(['/page/users'], { queryParams: { page: ++pageLabel } });
  
        } else if( label == '&laquo; Previous') {
  
          this.router.navigate(['/page/users'], { queryParams: { page: --pageLabel } });
  
        } else {
          this.router.navigate(['/page/users'], { queryParams: { page: label } });
        }
      }
  
    }

}
