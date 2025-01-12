import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { User } from '../shared/models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let storageSpy: { [key: string]: string } = {};
  
  // Sample user data for testing
  const mockUser: User = {

    name: 'Test User',
    role: 'admin'
  };

  beforeEach(() => {
    // Clear our storage spy object
    storageSpy = {};

    // Mock localStorage methods
    spyOn(localStorage, 'getItem').and.callFake((key: string): string => {
      return storageSpy[key];
    });
    
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): void => {
      storageSpy[key] = value;
    });
    
    spyOn(localStorage, 'removeItem').and.callFake((key: string): void => {
      delete storageSpy[key];
    });

    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setUser', () => {
    it('should set user and store in localStorage', () => {
      service.setUser(mockUser);
      
      expect(service.getUser()).toEqual(mockUser);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify(mockUser)
      );
    });
  });

  describe('getUser', () => {
    it('should return null if no user is set or stored', () => {
      expect(service.getUser()).toBeNull();
      expect(localStorage.getItem).toHaveBeenCalledWith('user');
    });

    it('should load user from localStorage if not in memory', () => {
      storageSpy['user'] = JSON.stringify(mockUser);
      
      const user = service.getUser();
      
      expect(user).toEqual(mockUser);
      expect(localStorage.getItem).toHaveBeenCalledWith('user');
    });

    it('should return cached user without accessing localStorage if already loaded', () => {
      service.setUser(mockUser);
      (localStorage.getItem as jasmine.Spy).calls.reset();
      
      const user = service.getUser();
      
      expect(user).toEqual(mockUser);
      expect(localStorage.getItem).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should clear user and remove from localStorage', () => {
      service.setUser(mockUser);
      service.logout();
      
      expect(service.getUser()).toBeNull();
      expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    });
  });

  describe('hasRole', () => {
    it('should return true if user has matching role', () => {
      service.setUser(mockUser);
      
      expect(service.hasRole('admin')).toBeTrue();
    });

    it('should return false if user has different role', () => {
      service.setUser(mockUser);
      
      expect(service.hasRole('user')).toBeFalse();
    });

    it('should return false if no user is set', () => {
      expect(service.hasRole('admin')).toBeFalse();
    });
  });

  describe('isLoggedIn', () => {
    it('should return true if user is set', () => {
      service.setUser(mockUser);
      
      expect(service.isLoggedIn()).toBeTrue();
    });

    it('should return false if no user is set', () => {
      expect(service.isLoggedIn()).toBeFalse();
    });
  });
});