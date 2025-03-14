import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeLogComponent } from './welcome-log.component';

describe('WelcomeLogComponent', () => {
  let component: WelcomeLogComponent;
  let fixture: ComponentFixture<WelcomeLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
