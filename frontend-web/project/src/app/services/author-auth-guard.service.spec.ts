/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuthorAuthGuardService } from './author-auth-guard.service';

describe('Service: AuthorAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthorAuthGuardService]
    });
  });

  it('should ...', inject([AuthorAuthGuardService], (service: AuthorAuthGuardService) => {
    expect(service).toBeTruthy();
  }));
});
