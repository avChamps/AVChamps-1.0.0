import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectPageComponent } from './redirect-page.component';

describe('RedirectPageComponent', () => {
  let component: RedirectPageComponent;
  let fixture: ComponentFixture<RedirectPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RedirectPageComponent]
    });
    fixture = TestBed.createComponent(RedirectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
