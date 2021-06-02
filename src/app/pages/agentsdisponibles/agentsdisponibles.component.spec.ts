import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentsdisponiblesComponent } from './agentsdisponibles.component';

describe('AgentsdisponiblesComponent', () => {
  let component: AgentsdisponiblesComponent;
  let fixture: ComponentFixture<AgentsdisponiblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentsdisponiblesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentsdisponiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
