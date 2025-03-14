import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Router } from '@angular/router';

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

}
