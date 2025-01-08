package be.pxl.services.controller;


import be.pxl.services.controller.dto.PostRequest;
import be.pxl.services.controller.dto.PostResponse;
import be.pxl.services.controller.dto.ReviewPostRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.exceptions.ResourceNotFoundException;
import be.pxl.services.service.IPostService;
import be.pxl.services.service.PostService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class PostController {

    private final IPostService postService;

    private static final Logger log = LoggerFactory.getLogger(PostController.class);

    private void validateRole(String role, String... allowedRoles) {
        for (String allowedRole : allowedRoles) {
            if (allowedRole.equalsIgnoreCase(role)) {
                return;
            }
        }
        throw new SecurityException("Access Denied: Insufficient permissions");
    }




    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void addPost(@RequestHeader("Role") String role, @RequestBody PostRequest post) {
        validateRole(role, "ADMIN", "EDITOR");
        log.info("Adding post: {}", post);
        postService.addPost(post);
    }


    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public void updatePost(
            @RequestHeader("Role") String role,
            @PathVariable Long id,
            @RequestBody PostRequest postRequest) throws ResourceNotFoundException {
        validateRole(role, "ADMIN", "EDITOR");
        log.info("Updating post with id: {} , post: {}", id, postRequest);
        postService.updatePost(id, postRequest);
    }


    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPost(@RequestHeader("Role") String role, @PathVariable Long id) throws ResourceNotFoundException {
        validateRole(role, "ADMIN", "EDITOR", "USER");

        Post post = postService.getPostById(id);

        PostResponse postResponse = PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .author(post.getAuthor())
                .createdAt(post.getCreatedAt())
                .isConcept(post.isConcept())
                .build();

        log.info("a person got a post: {}", postResponse);
        return ResponseEntity.ok(postResponse);
    }


    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts(@RequestHeader("Role") String role) {
        validateRole(role, "ADMIN", "EDITOR", "USER");
        List<PostResponse> posts = postService.getAllPosts();
        log.info("a person got all his posts: {}", posts);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("author/{author}")
    public ResponseEntity<List<PostResponse>> getPostsByAuthor(@RequestHeader("Role") String role, @PathVariable String author) {
        validateRole(role, "ADMIN", "EDITOR");
        List<PostResponse> posts = postService.getPostsByAuthor(author);
        log.info("a author got all his posts: {}", posts);
        return ResponseEntity.ok(posts);
    }


    @PutMapping("/review")
    @ResponseStatus(HttpStatus.OK)
    public void postReview(@RequestBody ReviewPostRequest reviewPostRequest) {
        postService.getReviewedPost(reviewPostRequest);
        log.info("a author put his post for submission with id: {}, post: {}", reviewPostRequest.getPostId(), reviewPostRequest);
    }
}
