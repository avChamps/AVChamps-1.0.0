import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaySelectorComponent } from './display-selector.component';

describe('DisplaySelectorComponent', () => {
  let component: DisplaySelectorComponent;
  let fixture: ComponentFixture<DisplaySelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplaySelectorComponent]
    });
    fixture = TestBed.createComponent(DisplaySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
