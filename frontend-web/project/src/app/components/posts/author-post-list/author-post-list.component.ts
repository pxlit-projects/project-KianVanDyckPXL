import { Component } from '@angular/core';
import { PostResponse } from '../../../shared/models/postResponse.model';
import { PostService } from '../../../services/post.service';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-author-post-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './author-post-list.component.html',
  styleUrls: ['./author-post-list.component.css']
})
export class AuthorPostListComponent {
  posts: PostResponse[] = [];

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private router: Router // Inject the Router service
  ) { }

  ngOnInit(): void {
    const author = this.authService.getUser()?.name;

    if (author) {
      // Fetch posts by author
      this.postService.getPostsByAuthor(author).subscribe(posts => {
        this.posts = posts;
      });
    } else {
      // Redirect to login if author is not found
      this.router.navigate(['/login']);
    }
  }


  editPost(postId: number): void {
    this.router.navigate(['/edit-post', postId]);
  }
}
