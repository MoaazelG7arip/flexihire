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
  locationChange = false;
  userLocation;
  list;
  ngOnInit(): void {
    this.loading = true;
    this.authService.onGetcompanies().subscribe({
      next: (res) => {
        this.loading = false;
        console.log(res);
        this.companies = res['data'];

 
        this.userLocation = JSON.parse(sessionStorage.getItem('user')).user.location;
        console.log(this.userLocation);
        this.list = 0;
        this.companies.forEach(company =>{
          if(company.location == this.userLocation){
            this.list++;
            console.log('done')
          }
        })
        console.log(this.list)
      },
      error: (error) => {
        this.loading = false;
        console.log(error);
      }
    })


  }

  onLocationChange(){
    console.log('Location changed');
    this.locationChange = !this.locationChange;
  }


}
