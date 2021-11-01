import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupAddressPage } from './pickup-address.page';

describe('PickupAddressPage', () => {
  let component: PickupAddressPage;
  let fixture: ComponentFixture<PickupAddressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickupAddressPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupAddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
