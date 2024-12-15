package be.pxl.services.controller;


import be.pxl.services.controller.dto.CommentRequest;
import be.pxl.services.controller.dto.UpdateCommentRequest;
import be.pxl.services.domain.Comment;
import be.pxl.services.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comment")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;


    @GetMapping("/{postId}")
    public ResponseEntity<List<Comment>> getComments(@PathVariable long postId) {
        return new ResponseEntity<>(commentService.getComments(postId), HttpStatus.OK);
    }

    @DeleteMapping("/{commentId}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteComment(@PathVariable long commentId) {
        commentService.deleteComment(commentId);
    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void addComment(@RequestBody CommentRequest comment) {
        commentService.addComment(comment);
    }


    @PutMapping("/{commentId}")
    @ResponseStatus(HttpStatus.OK)
    public void updateComment(@PathVariable long commentId,@RequestBody UpdateCommentRequest comment) {
        commentService.updateComment(commentId, comment);
    }
}
