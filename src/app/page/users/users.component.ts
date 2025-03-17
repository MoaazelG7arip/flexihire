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

  
  paginatedUsers: any[][] = []; // Array of arrays for paginated jobs
  currentPage = 0; // Current page index
  itemsPerPage = 10; // Number of jobs per page
  
    ngOnInit(): void {
      this.loading = true;
      this.informationService.onGetusers().subscribe({
        next: (res) => {
          this.loading = false;
          console.log(res);
          this.users = res['data'];
          this.paginateUsers();
        },
        error: (error) => {
          this.loading = false;
          console.log(error);
        }
      })
      
    }



        // Split jobs into chunks of 10
        paginateUsers(): void {
          for (let i = 0; i < this.users.length; i += this.itemsPerPage) {
            this.paginatedUsers.push(this.users.slice(i, i + this.itemsPerPage));
          }
        }
      
        // Navigate to the next page
        nextPage(): void {
          if (this.currentPage < this.paginatedUsers.length - 1) {
            this.currentPage++;
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
          }
        }
      
        // Navigate to the previous page
        previousPage(): void {
          if (this.currentPage > 0) {
            this.currentPage--;
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
          }
        }
    
        goToPage(page: number): void {
          this.currentPage = page;
          window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
        }
}
