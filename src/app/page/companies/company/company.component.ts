

import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoaderComponent } from "../../../shared/loader/loader.component";
import { CommonModule } from '@angular/common';
import { InformationService } from '../../../services/information.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule, LoaderComponent, RouterLink],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent implements OnDestroy {

  route: ActivatedRoute = inject(ActivatedRoute);
  informationService: InformationService = inject(InformationService);
  company = null;
  loading = false;
  mainUser = false;
  private routeSubscription: Subscription;

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
        let theUser = JSON.parse(sessionStorage.getItem('user'));
        if (theUser['user'].id == id) {
          this.mainUser = true;
        }
      },
      error: (error) => {
        this.loading = false;
        console.log(error);
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the route paramMap observable to prevent memory leaks
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
