import { TestBed } from '@angular/core/testing';

import { ReportService } from './report.service';

describe('PollingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportService = TestBed.get(ReportService);
    expect(service).toBeTruthy();
  });
});
