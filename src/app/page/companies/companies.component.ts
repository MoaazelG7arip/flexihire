import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProgressBarComponent } from "../../shared/progress-bar/progress-bar.component";
import { RouterLink } from '@angular/router';
import { LoaderComponent } from "../../shared/loader/loader.component";

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, ProgressBarComponent, RouterLink, LoaderComponent],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css'
})
export class CompaniesComponent {

  authService: AuthService = inject(AuthService);
  companies = [];
  loading = false;
  ngOnInit(): void {
    this.loading = true;
    this.authService.onGetcompanies().subscribe({
      next: (res) => {
        this.loading = false;
        console.log(res);
        this.companies = res['data'];
      },
      error: (error) => {
        this.loading = false;
        console.log(error);
      }
    })
    
  }


}
