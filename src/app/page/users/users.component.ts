import { Component, inject } from '@angular/core';
import { ProgressBarComponent } from "../../shared/progress-bar/progress-bar.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { InformationService } from '../../services/information.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ProgressBarComponent, RouterLink, LoaderComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {


  informationService: InformationService = inject(InformationService);
  users = [];
  loading: boolean = false;
  
    ngOnInit(): void {
      this.loading = true;
      this.informationService.onGetusers().subscribe({
        next: (res) => {
          this.loading = false;
          console.log(res);
          this.users = res['data'];
        },
        error: (error) => {
          this.loading = false;
          console.log(error);
        }
      })
      
    }
}
