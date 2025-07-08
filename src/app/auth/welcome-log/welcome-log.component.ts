import { Component, ElementRef, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import lottie from 'lottie-web';

@Component({
  selector: 'app-welcome-log',
  standalone: true,
  imports: [],
  templateUrl: './welcome-log.component.html',
  styleUrl: './welcome-log.component.css'
})
export class WelcomeLogComponent {


  router: Router = inject(Router);

  @Output() authStatus: EventEmitter<string> = new EventEmitter();
  @Output() logWithGoogle: EventEmitter<string> = new EventEmitter();
  onUpdatePageStatus(value:string) {
    this.router.navigate([`/auth/${value}`]);
  }

  @ViewChild('lottieContainer') lottieContainer!: ElementRef;

  ngAfterViewInit() {
    lottie.loadAnimation({
      container: this.lottieContainer.nativeElement,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'animation/Animation-background.json'
    });
  }

}
