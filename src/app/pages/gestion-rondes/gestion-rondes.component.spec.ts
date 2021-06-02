import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionRondesComponent } from './gestion-rondes.component';

describe('GestionRondesComponent', () => {
  let component: GestionRondesComponent;
  let fixture: ComponentFixture<GestionRondesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionRondesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionRondesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
