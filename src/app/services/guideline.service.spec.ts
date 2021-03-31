import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { GuidelineService } from './guideline.service';

describe('GuidelineService', () => {
  let service: GuidelineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(GuidelineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
