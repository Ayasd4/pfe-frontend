import { TestBed } from '@angular/core/testing';

import { TokenAdminService } from './token-admin.service';

describe('TokenAdminService', () => {
  let service: TokenAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
