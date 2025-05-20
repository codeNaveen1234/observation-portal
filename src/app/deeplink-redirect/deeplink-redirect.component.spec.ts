import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeeplinkRedirectComponent } from './deeplink-redirect.component';

describe('DeeplinkRedirectComponent', () => {
  let component: DeeplinkRedirectComponent;
  let fixture: ComponentFixture<DeeplinkRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeeplinkRedirectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeeplinkRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
