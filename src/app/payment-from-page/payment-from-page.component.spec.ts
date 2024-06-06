import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentFromPageComponent } from './payment-from-page.component';

describe('PaymentFromPageComponent', () => {
  let component: PaymentFromPageComponent;
  let fixture: ComponentFixture<PaymentFromPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentFromPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentFromPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
