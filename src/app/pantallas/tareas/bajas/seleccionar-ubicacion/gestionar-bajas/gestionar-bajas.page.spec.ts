import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarBajasPage } from './gestionar-bajas.page';

describe('GestionarBajasPage', () => {
  let component: GestionarBajasPage;
  let fixture: ComponentFixture<GestionarBajasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionarBajasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarBajasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
