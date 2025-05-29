import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationLedImpComponent } from './observation-led-imp.component';

describe('ObservationLedImpComponent', () => {
  let component: ObservationLedImpComponent;
  let fixture: ComponentFixture<ObservationLedImpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObservationLedImpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObservationLedImpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
