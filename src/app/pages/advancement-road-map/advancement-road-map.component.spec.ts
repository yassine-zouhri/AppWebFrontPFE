import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancementRoadMapComponent } from './advancement-road-map.component';

describe('AdvancementRoadMapComponent', () => {
  let component: AdvancementRoadMapComponent;
  let fixture: ComponentFixture<AdvancementRoadMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancementRoadMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancementRoadMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
