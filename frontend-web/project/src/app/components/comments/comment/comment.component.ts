import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentResponse } from '../../../shared/models/commentResponse.model';
import { CommentServiceService } from '../../../services/comment-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [MatFormFieldModule, CommonModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'], // Fixed styleUrls typo
})
export class CommentComponent {
  @Input() comment!: CommentResponse;
  editMode = false;
  editForm: FormGroup;
  @Output() commentDeleted = new EventEmitter<number>(); 


  constructor(
    private fb: FormBuilder,
    private commentService: CommentServiceService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.editForm = this.fb.group({
      comment: ['', [Validators.required]],
    });
  }

  ngOnChanges(): void {

    if (this.comment) {
      this.editForm.patchValue({ comment: this.comment.comment });
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;


    if (this.editMode) {
      this.editForm.patchValue({ comment: this.comment.comment });
    }
  }

  getUser() {
    return this.authService.getUser()?.name;
  }

  onSubmit(): void  {
    if (this.editForm.valid) {
      const updatedComment = this.editForm.value.comment;

      this.commentService.updateComment(this.comment.id, updatedComment).subscribe({
        next: () => {
          this.snackBar.open('Comment updated successfully!', 'Close', {
            duration: 3000,
          });

          this.comment.comment = updatedComment;

          this.editMode = false;
        },
        error: () => {
          this.snackBar.open('Failed to update comment.', 'Close', {
            duration: 3000,
          });
        },
      });
    }
  }

  deleteComment() {
    this.commentService.deleteComment(this.comment.id).subscribe({
      next: () => {
        this.snackBar.open('Comment deleted successfully!', 'Close', {
          duration: 3000,
        });

        this.commentDeleted.emit(this.comment.id); // Emit the comment ID
      },
      error: () => {
        this.snackBar.open('Failed to delete comment.', 'Close', {
          duration: 3000,
        });
      },
    });
  }
}