import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css'
})
export class PostCardComponent {
  @Input() post!: { id: number; title: string; author: string; createdAt: string, content: string };

  constructor(private router: Router) {}

  navigateToPost(): void {
    this.router.navigate(['/post', this.post.id]);
  }
}
