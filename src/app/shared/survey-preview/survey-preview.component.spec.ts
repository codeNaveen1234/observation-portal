import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyPreviewComponent } from './survey-preview.component';

describe('SurveyPreviewComponent', () => {
  let component: SurveyPreviewComponent;
  let fixture: ComponentFixture<SurveyPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurveyPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
