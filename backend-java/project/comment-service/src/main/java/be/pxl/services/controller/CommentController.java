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
@CrossOrigin(origins = "*")
public class CommentController {

    private final CommentService commentService;
    private void validateRole(String role) {
        if (!"ADMIN".equalsIgnoreCase(role) && !"EDITOR".equalsIgnoreCase(role) && !"USER".equalsIgnoreCase(role)) {
            throw new SecurityException("Access Denied: Insufficient permissions");
        }
    }

    @GetMapping("/{postId}")
    public ResponseEntity<List<Comment>> getComments(@RequestHeader("Role") String role, @PathVariable long postId) {
        validateRole(role);
        return new ResponseEntity<>(commentService.getComments(postId), HttpStatus.OK);
    }

    @DeleteMapping("/{commentId}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteComment(@RequestHeader("Role") String role, @PathVariable long commentId) {
        validateRole(role);
        commentService.deleteComment(commentId);
    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void addComment(@RequestHeader("Role") String role, @RequestBody CommentRequest comment) {
        validateRole(role);
        commentService.addComment(comment);
    }


    @PutMapping("/{commentId}")
    @ResponseStatus(HttpStatus.OK)
    public void updateComment(@RequestHeader("Role") String role, @PathVariable long commentId,@RequestBody UpdateCommentRequest comment) {
        validateRole(role);
        commentService.updateComment(commentId, comment);
    }
}
