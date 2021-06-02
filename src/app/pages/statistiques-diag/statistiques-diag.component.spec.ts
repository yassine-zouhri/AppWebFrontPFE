import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatistiquesDiagComponent } from './statistiques-diag.component';

describe('StatistiquesDiagComponent', () => {
  let component: StatistiquesDiagComponent;
  let fixture: ComponentFixture<StatistiquesDiagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatistiquesDiagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatistiquesDiagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
