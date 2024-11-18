import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorPostListComponent } from './author-post-list.component';

describe('AuthorPostListComponent', () => {
  let component: AuthorPostListComponent;
  let fixture: ComponentFixture<AuthorPostListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorPostListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthorPostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
