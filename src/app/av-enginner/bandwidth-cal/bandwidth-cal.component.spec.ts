import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandwidthCalComponent } from './bandwidth-cal.component';

describe('BandwidthCalComponent', () => {
  let component: BandwidthCalComponent;
  let fixture: ComponentFixture<BandwidthCalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BandwidthCalComponent]
    });
    fixture = TestBed.createComponent(BandwidthCalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
