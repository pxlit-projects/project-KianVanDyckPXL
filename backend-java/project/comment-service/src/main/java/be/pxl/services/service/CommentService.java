package be.pxl.services.service;

import be.pxl.services.controller.dto.CommentRequest;
import be.pxl.services.controller.dto.UpdateCommentRequest;
import be.pxl.services.domain.Comment;
import be.pxl.services.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    public List<Comment> getComments(Long postId) {
        return commentRepository.findByPostId(postId);
    }

    public void deleteComment(long commentId) {
        commentRepository.findById(commentId).ifPresent(commentRepository::delete);
    }


    public void addComment(CommentRequest commentRequest) {
        Comment comment = new Comment();
        comment.setPostId(commentRequest.getPostId());
        comment.setComment(commentRequest.getComment());
        comment.setAuthor(commentRequest.getAuthor());
        commentRepository.save(comment);
    }

    public void updateComment(long commentId,UpdateCommentRequest updateCommentRequest) {
       commentRepository.findById(commentId).ifPresent(comment -> {
           comment.setComment(updateCommentRequest.getComment());
           commentRepository.save(comment);
       });


    }
}
