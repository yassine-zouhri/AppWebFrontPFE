import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentSchedulerComponent } from './agent-scheduler.component';

describe('AgentSchedulerComponent', () => {
  let component: AgentSchedulerComponent;
  let fixture: ComponentFixture<AgentSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentSchedulerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
