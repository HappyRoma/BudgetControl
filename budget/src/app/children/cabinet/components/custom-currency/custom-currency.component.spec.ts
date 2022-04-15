import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCurrencyComponent } from './custom-currency.component';

describe('CustomCurrencyComponent', () => {
  let component: CustomCurrencyComponent;
  let fixture: ComponentFixture<CustomCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomCurrencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
