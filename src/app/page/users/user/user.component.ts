

import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoaderComponent } from "../../../shared/loader/loader.component";
import { CommonModule } from '@angular/common';
import { InformationService } from '../../../services/information.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [LoaderComponent, CommonModule, RouterLink],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnDestroy {

  route: ActivatedRoute = inject(ActivatedRoute);
  informationService: InformationService = inject(InformationService);
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
      },
      error: (error) => {
        this.loading = false;
        console.log(error);
      }
    });
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  ngOnDestroy(): void {
    // Unsubscribe from the route paramMap observable to prevent memory leaks
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}