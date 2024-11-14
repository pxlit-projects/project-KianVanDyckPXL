package be.pxl.services.controller;


import be.pxl.services.controller.dto.PostRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.service.IPostService;
import be.pxl.services.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

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
}
