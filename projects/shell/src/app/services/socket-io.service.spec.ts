import { TestBed } from '@angular/core/testing';

import { SocketIOService } from './socket-io.service';

describe('SocketIOService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SocketIOService = TestBed.get(SocketIOService);
    expect(service).toBeTruthy();
  });
});
