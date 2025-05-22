import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationAsTaskComponent } from './observation-as-task.component';

describe('ObservationAsTaskComponent', () => {
  let component: ObservationAsTaskComponent;
  let fixture: ComponentFixture<ObservationAsTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObservationAsTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObservationAsTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
