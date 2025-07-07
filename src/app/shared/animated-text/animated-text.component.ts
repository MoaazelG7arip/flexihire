import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-animated-text',
  standalone: true,
  imports: [CommonModule],
   animations: [
    trigger('wordAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  templateUrl: './animated-text.component.html',
  styleUrl: './animated-text.component.css'
})
export class AnimatedTextComponent {


  @Input() text: string = '';
  @Input() speed: number = 200; // milliseconds between words
  @Input() delay: number = 0; // initial delay in milliseconds
  @Output() contentUpdated = new EventEmitter<void>();

  
  displayedText: string = '';
  public words: string[] = [];
  public currentIndex: number = 0;
  public animationTimeout: any;

  ngOnInit() {
    this.words = this.text.split(' ');
    setTimeout(() => this.animateText(), this.delay);
  }

  ngOnDestroy() {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
  }

private animateText() {
  if (this.currentIndex < this.words.length) {
    this.displayedText += (this.currentIndex > 0 ? ' ' : '') + this.words[this.currentIndex];
    this.currentIndex++;
    this.contentUpdated.emit(); // Add this line
    this.animationTimeout = setTimeout(() => this.animateText(), this.speed);
  }
}

  restartAnimation() {
    this.displayedText = '';
    this.currentIndex = 0;
    this.animateText();
  }

}
