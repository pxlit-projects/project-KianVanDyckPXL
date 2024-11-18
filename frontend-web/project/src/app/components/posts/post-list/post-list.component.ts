import { Component } from '@angular/core';
import { PostResponse } from '../../../shared/models/postResponse.model';
import { PostService } from '../../../services/post.service';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent {

  posts: PostResponse[] = [];
  author: string = '';

  constructor(private postService: PostService, private authService: AuthService) { }

  ngOnInit(): void {

    const user = this.authService.getUser();
    if (user) {
      this.author = user.name;
      this.loadPosts();
    }
  }
    loadPosts(): void {
      this.postService.getPostsByAuthor(this.author).subscribe({
        next: (data) => {
          this.posts = data;
        },
        error: (err) => {
          console.error('Error fetching posts:', err);
        }
      });
    }
  }