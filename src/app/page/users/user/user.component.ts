import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoaderComponent } from "../../../shared/loader/loader.component";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {


  
    route: ActivatedRoute = inject(ActivatedRoute);
    authService: AuthService = inject(AuthService);
    user = null;
    loading = false;
  
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
        },
        error: (error) => {
          this.loading = false;
          console.log(error);
        }
      });
    }
}
