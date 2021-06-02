import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectationEventComponent } from './affectation-event.component';

describe('AffectationEventComponent', () => {
  let component: AffectationEventComponent;
  let fixture: ComponentFixture<AffectationEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AffectationEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AffectationEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
