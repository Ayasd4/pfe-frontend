import { TestBed } from '@angular/core/testing';

import { ConsulterService } from './consulter.service';

describe('ConsulterService', () => {
  let service: ConsulterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsulterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
