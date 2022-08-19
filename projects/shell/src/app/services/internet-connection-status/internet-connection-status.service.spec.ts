import { TestBed } from '@angular/core/testing';

import { InternetConnectionStatusService } from './internet-connection-status.service';

describe('InternetConnectionStatusService', () => {
  let service: InternetConnectionStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternetConnectionStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
