import { TestBed } from '@angular/core/testing';

import { BienesService } from './bienes.service';

describe('BienesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BienesService = TestBed.get(BienesService);
    expect(service).toBeTruthy();
  });
});
