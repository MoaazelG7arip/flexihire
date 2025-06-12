

import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoaderComponent } from "../../../shared/loader/loader.component";
import { CommonModule } from '@angular/common';
import { InformationService } from '../../../services/information.service';
import { Subscription } from 'rxjs';
import { NotificationComponent } from "../../../shared/notification/notification.component";

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule, LoaderComponent, RouterLink, NotificationComponent],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent implements OnDestroy {

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  informationService: InformationService = inject(InformationService);
  company = null;
  loading = false;
  mainUser = false;
  private routeSubscription: Subscription;
  notification = { isFound: false, message: '', status: '' };


  ngOnInit(): void {
    // Subscribe to paramMap to react to changes in the URL
    this.routeSubscription = this.route.paramMap.subscribe(paramMap => {
      const id = +paramMap.get('id')!;
      this.fetchCompanyDetails(id);
    });
  }

  fetchCompanyDetails(id: number): void {
    this.loading = true;
    this.informationService.onGetCompanyById(id).subscribe({
      next: (res) => {
        this.loading = false;
        console.log(res);
        this.company = res['company'];
        let theUser = JSON.parse(localStorage.getItem('user'));
        if (theUser['user'].id == id) {
          this.mainUser = true;
        }

        this.notification = {
          isFound: true,
          message: res['message'] || 'Companies fetched successfully',
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
          message: err.error.message || 'Companies not fetched ',
          status: 'alert',
        };
        setTimeout(() => {
          this.notification = { isFound: false, message: '', status: '' };
        }, 3500);
      }
    });
  }

    onContactMe(){
    sessionStorage.setItem('userChat', JSON.stringify(this.company));
    sessionStorage.setItem('chatType', 'company');
    sessionStorage.setItem('chatMobileChange', 'true')
    this.router.navigate(['/page/real-chat']);
  }



  ngOnDestroy(): void {
    // Unsubscribe from the route paramMap observable to prevent memory leaks
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
