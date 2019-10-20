import { TestBed } from '@angular/core/testing';

import { TareasService } from './tareas.service';

describe('TareasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TareasService = TestBed.get(TareasService);
    expect(service).toBeTruthy();
  });
});
