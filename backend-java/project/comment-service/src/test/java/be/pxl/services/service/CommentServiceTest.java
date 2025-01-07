package be.pxl.services.service;

import be.pxl.services.controller.dto.CommentRequest;
import be.pxl.services.controller.dto.UpdateCommentRequest;
import be.pxl.services.domain.Comment;
import be.pxl.services.repository.CommentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class CommentServiceTest {

    private CommentRepository commentRepository;
    private CommentService commentService;

    @BeforeEach
    void setUp() {
        commentRepository = Mockito.mock(CommentRepository.class);
        commentService = new CommentService(commentRepository);
    }

    @Test
    void getComments_ShouldReturnListOfComments_WhenPostIdIsValid() {
        long postId = 1L;
        List<Comment> comments = Arrays.asList(
                new Comment(1L, "Comment 1", "Author 1", postId),
                new Comment(2L, "Comment 2", "Author 2", postId)
        );

        when(commentRepository.findByPostId(postId)).thenReturn(comments);

        List<Comment> result = commentService.getComments(postId);

        assertThat(result).hasSize(2);
        assertThat(result).containsAll(comments);
        verify(commentRepository).findByPostId(postId);
    }

    @Test
    void deleteComment_ShouldDeleteComment_WhenCommentExists() {
        long commentId = 1L;
        Comment comment = new Comment(commentId, "Comment 1", "Author 1", 1L);

        when(commentRepository.findById(commentId)).thenReturn(Optional.of(comment));

        commentService.deleteComment(commentId);

        verify(commentRepository).delete(comment);
    }

    @Test
    void deleteComment_ShouldDoNothing_WhenCommentDoesNotExist() {
        long commentId = 1L;

        when(commentRepository.findById(commentId)).thenReturn(Optional.empty());

        commentService.deleteComment(commentId);

        verify(commentRepository, never()).delete(any());
    }

    @Test
    void addComment_ShouldSaveComment() {
        CommentRequest commentRequest = new CommentRequest("New Comment", 1L, "Author 1");
        ArgumentCaptor<Comment> commentCaptor = ArgumentCaptor.forClass(Comment.class);

        commentService.addComment(commentRequest);

        verify(commentRepository).save(commentCaptor.capture());
        Comment savedComment = commentCaptor.getValue();

        assertThat(savedComment.getComment()).isEqualTo("New Comment");
        assertThat(savedComment.getPostId()).isEqualTo(1L);
        assertThat(savedComment.getAuthor()).isEqualTo("Author 1");
    }

    @Test
    void updateComment_ShouldUpdateComment_WhenCommentExists() {
        long commentId = 1L;
        Comment existingComment = new Comment(commentId, "Old Comment", "Author 1", 1L);
        UpdateCommentRequest updateCommentRequest = new UpdateCommentRequest("Updated Comment");

        when(commentRepository.findById(commentId)).thenReturn(Optional.of(existingComment));

        commentService.updateComment(commentId, updateCommentRequest);

        verify(commentRepository).save(existingComment);
        assertThat(existingComment.getComment()).isEqualTo("Updated Comment");
    }

    @Test
    void updateComment_ShouldDoNothing_WhenCommentDoesNotExist() {
        long commentId = 1L;
        UpdateCommentRequest updateCommentRequest = new UpdateCommentRequest("Updated Comment");

        when(commentRepository.findById(commentId)).thenReturn(Optional.empty());

        commentService.updateComment(commentId, updateCommentRequest);

        verify(commentRepository, never()).save(any());
    }
}
