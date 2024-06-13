import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatioToolsComponent } from './ratio-tools.component';

describe('RatioToolsComponent', () => {
  let component: RatioToolsComponent;
  let fixture: ComponentFixture<RatioToolsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RatioToolsComponent]
    });
    fixture = TestBed.createComponent(RatioToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
