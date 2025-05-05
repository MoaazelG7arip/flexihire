import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealChatComponent } from './real-chat.component';

describe('RealChatComponent', () => {
  let component: RealChatComponent;
  let fixture: ComponentFixture<RealChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
