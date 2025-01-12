import { TestBed } from '@angular/core/testing';
import { AuthorAuthGuardService } from './author-auth-guard.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('AuthorAuthGuardService', () => {
  let service: AuthorAuthGuardService;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'hasRole']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthorAuthGuardService,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthorAuthGuardService);
    authServiceMock = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerMock = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should allow access when user is logged in and has "editor" role', () => {
    authServiceMock.isLoggedIn.and.returnValue(true);
    authServiceMock.hasRole.and.returnValue(true);

    const result = service.canActivate();

    expect(result).toBeTrue();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and navigate to login when user is not logged in', () => {
    authServiceMock.isLoggedIn.and.returnValue(false);

    const result = service.canActivate();

    expect(result).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should deny access and navigate to login when user does not have "editor" role', () => {
    authServiceMock.isLoggedIn.and.returnValue(true);
    authServiceMock.hasRole.and.returnValue(false);

    const result = service.canActivate();

    expect(result).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
