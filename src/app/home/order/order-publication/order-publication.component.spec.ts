import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPublicationComponent } from './order-publication.component';

describe('OrderPublicationComponent', () => {
  let component: OrderPublicationComponent;
  let fixture: ComponentFixture<OrderPublicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPublicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPublicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
