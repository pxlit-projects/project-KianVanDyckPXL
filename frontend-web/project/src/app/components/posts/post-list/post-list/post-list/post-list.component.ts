import { Component } from '@angular/core';
import { PostResponse } from '../../../../../shared/models/postResponse.model';
import { PostService } from '../../../../../services/post.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent {

  posts: PostResponse[] = [];

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    // Fetch all posts when the component loads
    this.postService.getAllPublishedPosts().subscribe(posts => {
      this.posts = posts;
    });
  }
}
