import { Component } from '@angular/core';
import { PostResponse } from '../../../shared/models/postResponse.model';
import { PostService } from '../../../services/post.service';
import { DatePipe, CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [DatePipe, FormsModule, CommonModule],
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
    private authService: AuthService
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
      // Convert post date to Date object
      const postDate = new Date(post.createdAt);
      
      // Search term filter (title and content)
      const matchesSearchTerm = 
        !this.searchTerm || 
        post.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        post.content.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Author filter
      const matchesAuthor = 
        !this.author || 
        post.author.toLowerCase().includes(this.author.toLowerCase());
      
      // Date range filter
      const matchesDateRange = this.checkDateRange(postDate);

      return matchesSearchTerm && matchesAuthor && matchesDateRange;
    });
  }

  // Precise date range checking method
  checkDateRange(postDate: Date): boolean {
    // If no date filters are set, return true
    if (!this.startDate && !this.endDate) return true;

    // Set start date to beginning of the day
    const startDateTime = this.startDate 
      ? this.setToStartOfDay(new Date(this.startDate)) 
      : null;

    // Set end date to end of the day
    const endDateTime = this.endDate 
      ? this.setToEndOfDay(new Date(this.endDate)) 
      : null;

    // Check date range
    const isAfterStart = !startDateTime || postDate >= startDateTime;
    const isBeforeEnd = !endDateTime || postDate <= endDateTime;

    return isAfterStart && isBeforeEnd;
  }

  // Helper method to set time to start of day (00:00:00)
  setToStartOfDay(date: Date): Date {
    date.setHours(0, 0, 0, 0);
    return date;
  }

  // Helper method to set time to end of day (23:59:59)
  setToEndOfDay(date: Date): Date {
    date.setHours(23, 59, 59, 999);
    return date;
  }

  // Method to clear all filters
  clearFilters(): void {
    this.searchTerm = '';
    this.author = '';
    this.startDate = null;
    this.endDate = null;
    this.filteredPosts = [...this.posts];
  }
}