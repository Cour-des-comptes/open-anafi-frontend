import { TestBed } from '@angular/core/testing';

import { CustomAlertService } from './custom-alert.service';

describe('CustomAlertService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomAlertService = TestBed.get(CustomAlertService);
    expect(service).toBeTruthy();
  });
});
