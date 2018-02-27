import { TestBed, inject } from '@angular/core/testing';

import { SkyboardService } from './skyboard.service';

describe('SkyboardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SkyboardService]
    });
  });

  it('should be created', inject([SkyboardService], (service: SkyboardService) => {
    expect(service).toBeTruthy();
  }));
});
