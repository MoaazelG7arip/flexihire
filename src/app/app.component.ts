import { Component } from '@angular/core';
import { Tooltip, initTWE } from 'tw-elements';
import { AuthComponent } from './auth/auth.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AuthComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'flexihire';

  ngOnInit() {
    initTWE({ Tooltip });
  }
}
