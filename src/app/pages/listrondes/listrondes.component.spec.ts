import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListrondesComponent } from './listrondes.component';

describe('ListrondesComponent', () => {
  let component: ListrondesComponent;
  let fixture: ComponentFixture<ListrondesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListrondesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListrondesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
