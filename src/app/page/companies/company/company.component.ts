import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoaderComponent } from "../../../shared/loader/loader.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule, LoaderComponent, RouterLink],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent {

  route: ActivatedRoute = inject(ActivatedRoute);
  authService: AuthService = inject(AuthService);
  company = null;
  loading = false;
  mainUser = false;


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
        let theUser = JSON.parse(sessionStorage.getItem('user'));
        if(theUser['user'].id == id){
          this.mainUser = true;
        }
      },
      error: (error) => {
        this.loading = false;
        console.log(error);
      }
    });
  }
}
