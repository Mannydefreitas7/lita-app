import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CongregationsComponent } from './congregations.component';

describe('CongregationsComponent', () => {
  let component: CongregationsComponent;
  let fixture: ComponentFixture<CongregationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CongregationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CongregationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
