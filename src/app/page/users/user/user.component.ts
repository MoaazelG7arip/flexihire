import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoaderComponent } from "../../../shared/loader/loader.component";
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [LoaderComponent, CommonModule, RouterLink],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {


  
    route: ActivatedRoute = inject(ActivatedRoute);
    authService: AuthService = inject(AuthService);
    user;
    loading = false;
    mainUser = false;
  
    ngOnInit(): void {
      // Get the ID from the route parameters
      const id = +this.route.snapshot.paramMap.get('id')!;
      this.loading = true;
      // Fetch the company details (replace with actual API call or service)
      this.authService.onGetUserById(id).subscribe({
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
