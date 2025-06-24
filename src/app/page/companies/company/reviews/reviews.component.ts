import { Component, inject } from '@angular/core';
import { LoaderComponent } from '../../../../shared/loader/loader.component';
import { Subscription } from 'rxjs';
import { InformationService } from '../../../../services/information.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from "../../../../shared/notification/notification.component";

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [LoaderComponent, CommonModule, NotificationComponent],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css',
})
export class ReviewsComponent {


    route: ActivatedRoute = inject(ActivatedRoute);
    informationService: InformationService = inject(InformationService);
    company = null;
    reviews = null;
    loading = false;
    mainUser = false;
  
    reviewState = false;
  
    private routeSubscription: Subscription;
    notification = { isFound: false, message: '', status: '' };

  ngOnInit(): void {
    // Subscribe to paramMap to react to changes in the URL
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
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
        this.reviews = res['company']['reviews']['items'];
        console.log(this.reviews);

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
      },
    });
  }
}
