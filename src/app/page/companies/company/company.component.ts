import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoaderComponent } from "../../../shared/loader/loader.component";

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent {

  route: ActivatedRoute = inject(ActivatedRoute);
  authService: AuthService = inject(AuthService);
  company = null;
  loading = false;

  ngOnInit(): void {
    // Get the ID from the route parameters
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loading = true;
    // Fetch the company details (replace with actual API call or service)
    this.authService.onGetCompanyById(id).subscribe({
      next: (res) => {
        this.loading = false;
        console.log(res);
        this.company = res['company'];
      },
      error: (error) => {
        this.loading = false;
        console.log(error);
      }
    });
  }
}
