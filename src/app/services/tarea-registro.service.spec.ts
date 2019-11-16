import { TestBed } from '@angular/core/testing';

import { TareaRegistroService } from './tarea-registro.service';

describe('TareaRegistroService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TareaRegistroService = TestBed.get(TareaRegistroService);
    expect(service).toBeTruthy();
  });
});
