import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarBienPage } from './gestionar-bien.page';

describe('GestionarBienPage', () => {
  let component: GestionarBienPage;
  let fixture: ComponentFixture<GestionarBienPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionarBienPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarBienPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
