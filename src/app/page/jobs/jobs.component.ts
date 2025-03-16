import { Component, inject } from '@angular/core';
import { InformationService } from '../../services/information.service';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css'
})
export class JobsComponent {

  informationService: InformationService = inject(InformationService);
  jobs = [];

  ngOnInit(): void {
    
    this.informationService.onGetJobs().subscribe({
      next: (res) => {
        console.log(res);
        this.jobs = res['jobs'];
      },
      error: (err) => {
        console.log(err);
      }
    });
    
  }

  

}
