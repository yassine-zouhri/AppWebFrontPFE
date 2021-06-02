import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventinperiodeComponent } from './eventinperiode.component';

describe('EventinperiodeComponent', () => {
  let component: EventinperiodeComponent;
  let fixture: ComponentFixture<EventinperiodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventinperiodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventinperiodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
