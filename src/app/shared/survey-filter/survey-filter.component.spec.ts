import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyFilterComponent } from './survey-filter.component';

describe('SurveyFilterComponent', () => {
  let component: SurveyFilterComponent;
  let fixture: ComponentFixture<SurveyFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurveyFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
