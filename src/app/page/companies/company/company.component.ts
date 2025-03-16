import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoaderComponent } from "../../../shared/loader/loader.component";
import { CommonModule } from '@angular/common';
import { InformationService } from '../../../services/information.service';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule, LoaderComponent, RouterLink],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent {

  route: ActivatedRoute = inject(ActivatedRoute);
  informationService: InformationService = inject(InformationService);
  company = null;
  loading = false;
  mainUser = false;


  ngOnInit(): void {
    // Get the ID from the route parameters
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loading = true;
    // Fetch the company details (replace with actual API call or service)
    this.informationService.onGetCompanyById(id).subscribe({
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
