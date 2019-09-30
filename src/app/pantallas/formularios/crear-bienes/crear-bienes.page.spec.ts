import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearBienesPage } from './crear-bienes.page';

describe('CrearBienesPage', () => {
  let component: CrearBienesPage;
  let fixture: ComponentFixture<CrearBienesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearBienesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearBienesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
