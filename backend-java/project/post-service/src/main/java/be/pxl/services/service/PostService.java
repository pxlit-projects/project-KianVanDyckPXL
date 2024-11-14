package be.pxl.services.service;


import be.pxl.services.controller.dto.PostRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService {

    private final PostRepository _postRepository;


    @Override
    public void addPost(PostRequest postRequest) {
        Post post = Post.builder()
                .title(postRequest.getTitle())
                .content(postRequest.getContent())
                .author(postRequest.getAuthor())
                .createdAt(LocalDateTime.now())
                .build();

        _postRepository.save(post);


    }
}
