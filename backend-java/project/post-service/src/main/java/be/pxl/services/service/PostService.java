package be.pxl.services.service;


import be.pxl.services.controller.dto.PostRequest;
import be.pxl.services.controller.dto.PostResponse;
import be.pxl.services.domain.Post;
import be.pxl.services.exceptions.ResourceNotFoundException;
import be.pxl.services.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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
                .isConcept(postRequest.isConcept())
                .build();


        _postRepository.save(post);
    }

    @Override
    public void updatePost(Long id, PostRequest postRequest) throws ResourceNotFoundException {
        Post existingPost = _postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
        existingPost.setTitle(postRequest.getTitle());
        existingPost.setContent(postRequest.getContent());
        existingPost.setAuthor(postRequest.getAuthor());
        existingPost.setConcept(postRequest.isConcept());

        _postRepository.save(existingPost);
    }

    public Post getPostById(Long id) throws ResourceNotFoundException {
        // Fetch the post from the repository
        return _postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
    }

    public List<Post> getAllPosts() {
        return _postRepository.findAllByConceptIsFalse();
    }

    public List<PostResponse> getPostsByAuthor(String author) {
        return _postRepository.findByAuthor(author).stream()
                .map(post -> PostResponse.builder()
                        .id(post.getId())
                        .title(post.getTitle())
                        .content(post.getContent())
                        .author(post.getAuthor())
                        .createdAt(post.getCreatedAt())
                        .isConcept(post.isConcept())
                        .build())
                .collect(Collectors.toList());
    }
}
