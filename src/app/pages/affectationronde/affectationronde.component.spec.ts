import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectationrondeComponent } from './affectationronde.component';

describe('AffectationrondeComponent', () => {
  let component: AffectationrondeComponent;
  let fixture: ComponentFixture<AffectationrondeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AffectationrondeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AffectationrondeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
