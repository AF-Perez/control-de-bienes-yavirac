import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecetasPage } from './recetas.page';

describe('RecetasPage', () => {
  let component: RecetasPage;
  let fixture: ComponentFixture<RecetasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecetasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecetasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
