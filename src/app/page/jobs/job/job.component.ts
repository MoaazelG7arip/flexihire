import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { InformationService } from '../../../services/information.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoaderComponent } from "../../../shared/loader/loader.component";

@Component({
  selector: 'app-job',
  standalone: true,
  imports: [CommonModule, RouterLink, LoaderComponent],
  templateUrl: './job.component.html',
  styleUrl: './job.component.css'
})
export class JobComponent {

  
  loading = false;
  job = null;

  informationService: InformationService = inject(InformationService);
  route: ActivatedRoute = inject(ActivatedRoute);
  ngOnInit(): void {
    this.loading = true;
    const id = +this.route.snapshot.paramMap.get('id')!;

    this.informationService.onGetJobById(id).subscribe({
      next: (res) => {
        console.log(res);
        this.loading = false;
        this.job = res['job'];


      },
      error: (err) => {
        this.loading = false;
        console.log(err);
      }
    });
    
  }



}
