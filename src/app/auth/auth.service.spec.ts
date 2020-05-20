import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });
});

let authService = null;

describe("Magic 8 Ball Service", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it("Should return a non empty array", () => {
    const service: AuthService = TestBed.get(AuthService);
    let result = service.getHeaders();
    expect(result instanceof Object).toBeTruthy;
    expect((Object.keys(result)).length).toBeTruthy;
  });
});