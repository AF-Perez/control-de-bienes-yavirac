import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaratulaPage } from './caratula.page';

describe('CaratulaPage', () => {
  let component: CaratulaPage;
  let fixture: ComponentFixture<CaratulaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaratulaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaratulaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
