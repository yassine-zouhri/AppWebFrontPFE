import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventAssignmentComponent } from './event-assignment.component';

describe('EventAssignmentComponent', () => {
  let component: EventAssignmentComponent;
  let fixture: ComponentFixture<EventAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventAssignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
