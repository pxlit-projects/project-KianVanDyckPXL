package be.pxl.services.service;

import be.pxl.services.controller.dto.PostRequest;
import be.pxl.services.controller.dto.PostResponse;
import be.pxl.services.controller.dto.PostReviewRequest;
import be.pxl.services.controller.dto.ReviewPostRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.domain.ReviewStatus;
import be.pxl.services.exceptions.ResourceNotFoundException;
import be.pxl.services.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService {

    private final PostRepository postRepository;
    private final RabbitTemplate rabbitTemplate;

    @Override
    public void addPost(PostRequest postRequest) {
        Post post = Post.builder()
                .title(postRequest.getTitle())
                .content(postRequest.getContent())
                .author(postRequest.getAuthor())
                .createdAt(LocalDateTime.now())
                .isConcept(postRequest.isConcept())
                .build();

        if (!postRequest.isConcept()) {
            post.setReviewStatus(ReviewStatus.PENDING);
        }


        Post newPost = postRepository.save(post);

        if (!newPost.isConcept()) {
            sendPostForReview(newPost);
        }
    }

    @Override
    public void updatePost(Long id, PostRequest postRequest) throws ResourceNotFoundException {
        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));

        existingPost.setTitle(postRequest.getTitle());
        existingPost.setContent(postRequest.getContent());
        existingPost.setAuthor(postRequest.getAuthor());
        existingPost.setConcept(postRequest.isConcept());


        if (!postRequest.isConcept()) {
            existingPost.setReviewStatus(ReviewStatus.PENDING);
        }

        Post savedPost = postRepository.save(existingPost);

        if (!savedPost.isConcept()) {
            sendPostForReview(savedPost);
        }
    }


    private void sendPostForReview(Post post) {
        PostReviewRequest newReview = PostReviewRequest.builder()
                .postId(post.getId())
                .author(post.getAuthor())
                .content(post.getContent())
                .title(post.getTitle())
                .build();

        rabbitTemplate.convertAndSend("reviewQueue", newReview);
    }

    public Post getPostById(Long id) throws ResourceNotFoundException {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
    }

    public List<PostResponse> getAllPosts() {
        return postRepository.findAllByApprovedTrue().stream()
                .map(post -> PostResponse.builder()
                        .id(post.getId())
                        .title(post.getTitle())
                        .content(post.getContent())
                        .author(post.getAuthor())
                        .createdAt(post.getCreatedAt())
                        .isConcept(post.isConcept())
                        .reviewStatus(post.getReviewStatus())
                        .comment(post.getReviewComment())
                        .build())
                .collect(Collectors.toList());
    }

    public List<PostResponse> getPostsByAuthor(String author) {
        return postRepository.findByAuthor(author).stream()
                .map(post -> PostResponse.builder()
                        .id(post.getId())
                        .title(post.getTitle())
                        .content(post.getContent())
                        .author(post.getAuthor())
                        .createdAt(post.getCreatedAt())
                        .isConcept(post.isConcept())
                        .reviewStatus(post.getReviewStatus())
                        .comment(post.getReviewComment())
                        .build())
                .collect(Collectors.toList());
    }



    public void getReviewedPost(ReviewPostRequest reviewPostRequest) {
        Post post = postRepository.findById(reviewPostRequest.getPostId()).orElseThrow();

        post.setReviewStatus(reviewPostRequest.getStatus());
        post.setReviewComment(reviewPostRequest.getComment());
        postRepository.save(post);
    }
}
