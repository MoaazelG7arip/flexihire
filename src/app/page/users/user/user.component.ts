

import { Component, ElementRef, inject, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoaderComponent } from "../../../shared/loader/loader.component";
import { CommonModule } from '@angular/common';
import { InformationService } from '../../../services/information.service';
import { Subscription } from 'rxjs';
import { NotificationComponent } from "../../../shared/notification/notification.component";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [LoaderComponent, CommonModule, RouterLink, NotificationComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnDestroy {

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router)
  informationService: InformationService = inject(InformationService);
  notification = { isFound: false, message: '', status: '' };
  user;
  loading = false;
  mainUser = false;
  private routeSubscription: Subscription;

  ngOnInit(): void {
    // Subscribe to paramMap to react to changes in the URL
    this.routeSubscription = this.route.paramMap.subscribe(paramMap => {
      const id = +paramMap.get('id')!;
      this.fetchUserDetails(id);
    });
  }

  fetchUserDetails(id: number): void {
    this.loading = true;
    this.informationService.onGetUserById(id).subscribe({
      next: (res) => {
        this.loading = false;
        console.log(res);
        this.user = res['user'];
        let theUser = JSON.parse(localStorage.getItem('user'));
        if (theUser['user'].id == id) {
          this.mainUser = true;
        }


        this.notification = {
          isFound: true,
          message: res['message'] || 'User fetched successfully',
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
          message: err.error.message || 'User not fetched ',
          status: 'alert',
        };
        setTimeout(() => {
          this.notification = { isFound: false, message: '', status: '' };
        }, 3500);
      }
    });
  }  

  ngOnDestroy(): void {
    // Unsubscribe from the route paramMap observable to prevent memory leaks
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  contactWith(){
    sessionStorage.setItem('userChat', JSON.stringify(this.user));
    sessionStorage.setItem('chatType', 'user');
    sessionStorage.setItem('chatMobileChange', 'true')
    this.router.navigate(['/page/real-chat']);
  }
}