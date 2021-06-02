import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInfoToCheckPointsComponent } from './add-info-to-check-points.component';

describe('AddInfoToCheckPointsComponent', () => {
  let component: AddInfoToCheckPointsComponent;
  let fixture: ComponentFixture<AddInfoToCheckPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInfoToCheckPointsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInfoToCheckPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
