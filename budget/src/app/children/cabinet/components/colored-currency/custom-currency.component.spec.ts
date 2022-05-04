import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColoredCurrencyComponent } from './colored-currency.component';

describe('ColoredCurrencyComponent', () => {
  let component: ColoredCurrencyComponent;
  let fixture: ComponentFixture<ColoredCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColoredCurrencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColoredCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
