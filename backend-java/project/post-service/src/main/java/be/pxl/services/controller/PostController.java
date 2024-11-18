package be.pxl.services.controller;


import be.pxl.services.controller.dto.PostRequest;
import be.pxl.services.controller.dto.PostResponse;
import be.pxl.services.domain.Post;
import be.pxl.services.exceptions.ResourceNotFoundException;
import be.pxl.services.service.IPostService;
import be.pxl.services.service.PostService;
import lombok.RequiredArgsConstructor;
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


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void addPost(@RequestBody PostRequest post) {

        postService.addPost(post);
    }


    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public void updatePost(
            @PathVariable Long id,
            @RequestBody PostRequest postRequest) throws ResourceNotFoundException {
        postService.updatePost(id, postRequest);

    }


    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<PostResponse> getPost(@PathVariable Long id) throws ResourceNotFoundException {

        Post post = postService.getPostById(id);

        PostResponse postResponse = PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .author(post.getAuthor())
                .createdAt(post.getCreatedAt())
                .isConcept(post.isConcept())
                .build();

        return ResponseEntity.ok(postResponse);
    }


    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();

        // Convert list of Post entities to a list of PostResponse DTOs
        List<PostResponse> postResponses = posts.stream()
                .map(post -> PostResponse.builder()
                        .id(post.getId())
                        .title(post.getTitle())
                        .content(post.getContent())
                        .author(post.getAuthor())
                        .createdAt(post.getCreatedAt())
                        .isConcept(post.isConcept())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(postResponses);
    }

    @GetMapping("author/{author}")
    public ResponseEntity<List<PostResponse>> getPostsByAuthor(@PathVariable String author) {
        List<PostResponse> posts = postService.getPostsByAuthor(author);
        return ResponseEntity.ok(posts);
    }


}
