import { Component } from '@angular/core';
import { PostResponse } from '../../../shared/models/postResponse.model';
import { PostService } from '../../../services/post.service';
import { DatePipe, CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PostCardComponent } from '../post-card/post-card/post-card.component';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [DatePipe, FormsModule, CommonModule, PostCardComponent],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent {
  posts: PostResponse[] = [];
  filteredPosts: PostResponse[] = [];

  // Filter properties
  searchTerm: string = '';
  author: string = '';
  startDate: string | null = null;
  endDate: string | null = null;

  constructor(
    private postService: PostService, 
    private authService: AuthService,
    private router: Router 
  ) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getAllPublishedPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.filteredPosts = [...this.posts];
      },
      error: (err) => {
        console.error('Error fetching posts:', err);
      }
    });
  }

  applyFilter(): void {
    this.filteredPosts = this.posts.filter(post => {

      const postDate = new Date(post.createdAt);
      
  
      const matchesSearchTerm = 
        !this.searchTerm || 
        post.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        post.content.toLowerCase().includes(this.searchTerm.toLowerCase());
      
   
      const matchesAuthor = 
        !this.author || 
        post.author.toLowerCase().includes(this.author.toLowerCase());
      

      const matchesDateRange = this.checkDateRange(postDate);

      return matchesSearchTerm && matchesAuthor && matchesDateRange;
    });
  }


  checkDateRange(postDate: Date): boolean {

    if (!this.startDate && !this.endDate) return true;

    const startDateTime = this.startDate 
      ? this.setToStartOfDay(new Date(this.startDate)) 
      : null;

    const endDateTime = this.endDate 
      ? this.setToEndOfDay(new Date(this.endDate)) 
      : null;

    const isAfterStart = !startDateTime || postDate >= startDateTime;
    const isBeforeEnd = !endDateTime || postDate <= endDateTime;

    return isAfterStart && isBeforeEnd;
  }

  setToStartOfDay(date: Date): Date {
    date.setHours(0, 0, 0, 0);
    return date;
  }

  setToEndOfDay(date: Date): Date {
    date.setHours(23, 59, 59, 999);
    return date;
  }


  clearFilters(): void {
    this.searchTerm = '';
    this.author = '';
    this.startDate = null;
    this.endDate = null;
    this.filteredPosts = [...this.posts];
  }


}