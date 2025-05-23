import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationEntityComponent } from './observation-entity.component';

describe('ObservationEntityComponent', () => {
  let component: ObservationEntityComponent;
  let fixture: ComponentFixture<ObservationEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObservationEntityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObservationEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
