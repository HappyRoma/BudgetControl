import { TestBed } from '@angular/core/testing';

import { OperationStatisticService } from './operation-statistic.service';

describe('OperationStatisticService', () => {
  let service: OperationStatisticService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperationStatisticService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
