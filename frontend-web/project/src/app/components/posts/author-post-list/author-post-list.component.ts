import { Component } from '@angular/core';

import { PostResponse } from '../../../shared/models/postResponse.model';
import { PostService } from '../../../services/post.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-author-post-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './author-post-list.component.html',
  styleUrl: './author-post-list.component.css'
})
export class AuthorPostListComponent {
  posts: PostResponse[] = [];

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    // Fetch all posts when the component loads
    this.postService.getAllPublishedPosts().subscribe(posts => {
      this.posts = posts;
    });
  }
}

