import { Component, inject } from '@angular/core';
import { ProgressBarComponent } from "../../shared/progress-bar/progress-bar.component";
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { InformationService } from '../../services/information.service';
import { NotificationComponent } from "../../shared/notification/notification.component";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ProgressBarComponent, RouterLink, LoaderComponent, NotificationComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {


  informationService: InformationService = inject(InformationService);
  users = [];
  loading: boolean = false;
  MainUser: any;
  notification = { isFound: false, message: '', status: '' };

  
  route : ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  routeSubscription: any;
  paginationLinks = [];
  
    ngOnInit(): void {
      
      sessionStorage.removeItem('addInfo');


      this.routeSubscription = this.route.queryParamMap.subscribe(queryMap => {
        let page = +queryMap.get('page');
        let search = queryMap.get('search');
        let jobSearch = queryMap.get('jobSearch');

        
        if(page == 0){ page = 1 }
        if(search == null){ search = '' }
        if(jobSearch == null){ jobSearch = '' }
        
        this.fetchUsersDetails(page, search, jobSearch);
      });


      
    }
    
    fetchUsersDetails(page, search, jobSearch) {
      this.loading = true;
      this.informationService.onGetUsersByUrl(page, search, jobSearch).subscribe({
        next: (res) => {
          this.loading = false;
          console.log(res);
          this.users = res['data']['data'];
          this.paginationLinks = res['data']['links'];          
          this.MainUser = JSON.parse(localStorage.getItem('user'));
          this.notification = {
            isFound: true,
            message: res['message'] || 'Users fetched successfully',
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
            message: err.error.message || 'Error fetching Users',
            status: 'alert',
          };
          setTimeout(() => {
            this.notification = { isFound: false, message: '', status: '' };
          }, 3500);
        }
      })
    
    }




    goToPage(label, url){
      if(url != null){
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
        let pageLabel = +this.route.snapshot.queryParamMap.get('page');
        let search = this.route.snapshot.queryParamMap.get('search');
        let jobSearch = this.route.snapshot.queryParamMap.get('jobSearch');
  
        if(pageLabel == 0){ pageLabel = 1 }
        if(search == null){ search = '' }
        if(jobSearch == null){ jobSearch = '' }
  
        if (label == 'Next &raquo;') {
  
          this.router.navigate(['/page/users'], { queryParams: { page: ++pageLabel, search: search, jobSearch: jobSearch } });
  
        } else if( label == '&laquo; Previous') {
  
          this.router.navigate(['/page/users'], { queryParams: { page: --pageLabel, search: search, jobSearch: jobSearch } });
  
        } else {
          this.router.navigate(['/page/users'], { queryParams: { page: label, search: search, jobSearch: jobSearch } });
        }
      }
  
    }
  
    // onSearch(event: any) {
    onSearch(username, jobTitle) {
  
      // this.router.navigate(['/page/users'], { queryParams: { page: 1 , search : event.value} }); 
      this.router.navigate(['/page/users'], { queryParams: { page: 1 , search : username.value, jobSearch : jobTitle.value} }); 
  
    }

    onContactMe(event: Event, user: any){
      event.stopPropagation();
      sessionStorage.setItem('userChat', JSON.stringify(user));
      sessionStorage.setItem('chatType', 'user');
      sessionStorage.setItem('chatMobileChange', 'true')
      this.router.navigate(['/page/real-chat']);
    }

}
