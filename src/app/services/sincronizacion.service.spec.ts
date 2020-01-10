import { TestBed } from '@angular/core/testing';

import { SincronizacionService } from './sincronizacion.service';

describe('SincronizacionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SincronizacionService = TestBed.get(SincronizacionService);
    expect(service).toBeTruthy();
  });
});
