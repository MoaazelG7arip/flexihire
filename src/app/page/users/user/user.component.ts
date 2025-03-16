import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoaderComponent } from "../../../shared/loader/loader.component";
import { CommonModule } from '@angular/common';
import { InformationService } from '../../../services/information.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [LoaderComponent, CommonModule, RouterLink],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {


  
    route: ActivatedRoute = inject(ActivatedRoute);
    informationService: InformationService = inject(InformationService);
    user;
    loading = false;
    mainUser = false;
  
    ngOnInit(): void {
      // Get the ID from the route parameters
      const id = +this.route.snapshot.paramMap.get('id')!;
      this.loading = true;
      // Fetch the company details (replace with actual API call or service)
      this.informationService.onGetUserById(id).subscribe({
        next: (res) => {
          this.loading = false;
          console.log(res);
          this.user = res['user'];
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


    getRandomColor(): string {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
    
}
