import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentAgentLocationsComponent } from './current-agent-locations.component';

describe('CurrentAgentLocationsComponent', () => {
  let component: CurrentAgentLocationsComponent;
  let fixture: ComponentFixture<CurrentAgentLocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentAgentLocationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentAgentLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
