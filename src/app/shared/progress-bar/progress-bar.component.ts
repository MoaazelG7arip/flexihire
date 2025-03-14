import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css'
})
export class ProgressBarComponent {

  scrollProgress = 0;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.updateProgress();
  }

  ngOnInit() {
    this.updateProgress();
  }

  private updateProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollY = window.scrollY;

    const maxScroll = documentHeight - windowHeight;
    this.scrollProgress = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
  }


}
