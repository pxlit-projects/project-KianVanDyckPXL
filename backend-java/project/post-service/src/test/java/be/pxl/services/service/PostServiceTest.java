package be.pxl.services.service;

import be.pxl.services.controller.dto.PostRequest;
import be.pxl.services.controller.dto.PostResponse;
import be.pxl.services.controller.dto.PostReviewRequest;
import be.pxl.services.controller.dto.ReviewPostRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.domain.ReviewStatus;
import be.pxl.services.exceptions.ResourceNotFoundException;
import be.pxl.services.repository.PostRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PostServiceTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private PostService postService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddPost_ConceptPost() {
        // Arrange
        PostRequest postRequest = new PostRequest("Title", "Content", "Author", true);
        Post savedPost = Post.builder()
                .id(1L)
                .title("Title")
                .content("Content")
                .author("Author")
                .isConcept(true)
                .createdAt(LocalDateTime.now())
                .build();
        when(postRepository.save(any(Post.class))).thenReturn(savedPost);

        // Act
        postService.addPost(postRequest);

        // Assert
        verify(postRepository, times(1)).save(any(Post.class));
        verifyNoInteractions(rabbitTemplate);
    }

    @Test
    void testAddPost_NonConceptPost() {
        // Arrange
        PostRequest postRequest = new PostRequest("Title", "Content", "Author", false);
        Post savedPost = Post.builder()
                .id(1L)
                .title("Title")
                .content("Content")
                .author("Author")
                .isConcept(false)
                .reviewStatus(ReviewStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();
        when(postRepository.save(any(Post.class))).thenReturn(savedPost);

        // Act
        postService.addPost(postRequest);

        // Assert
        verify(postRepository, times(1)).save(any(Post.class));
        verify(rabbitTemplate, times(1)).convertAndSend(eq("reviewQueue"), any(PostReviewRequest.class));
    }

    @Test
    void testUpdatePost_Success() throws ResourceNotFoundException {
        // Arrange
        Long postId = 1L;
        Post existingPost = Post.builder()
                .id(postId)
                .title("Old Title")
                .content("Old Content")
                .author("Old Author")
                .isConcept(true)
                .createdAt(LocalDateTime.now())
                .build();

        PostRequest postRequest = new PostRequest("New Title", "New Content", "New Author", false);

        when(postRepository.findById(postId)).thenReturn(Optional.of(existingPost));
        when(postRepository.save(any(Post.class))).thenReturn(existingPost);

        // Act
        postService.updatePost(postId, postRequest);

        // Assert
        verify(postRepository, times(1)).save(any(Post.class));
        verify(rabbitTemplate, times(1)).convertAndSend(eq("reviewQueue"), any(PostReviewRequest.class));
    }

    @Test
    void testUpdatePost_ResourceNotFound() {
        // Arrange
        Long postId = 1L;
        PostRequest postRequest = new PostRequest("Title", "Content", "Author", false);

        when(postRepository.findById(postId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> postService.updatePost(postId, postRequest));
        verify(postRepository, times(0)).save(any(Post.class));
        verifyNoInteractions(rabbitTemplate);
    }

    @Test
    void testGetPostById_Success() throws ResourceNotFoundException {
        // Arrange
        Long postId = 1L;
        Post post = new Post();
        post.setId(postId);

        when(postRepository.findById(postId)).thenReturn(Optional.of(post));

        // Act
        Post result = postService.getPostById(postId);

        // Assert
        assertEquals(postId, result.getId());
        verify(postRepository, times(1)).findById(postId);
    }

    @Test
    void testGetPostById_ResourceNotFound() {
        // Arrange
        Long postId = 1L;
        when(postRepository.findById(postId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> postService.getPostById(postId));
    }

    @Test
    void testGetAllPosts() {
        // Arrange
        Post post1 = Post.builder().id(1L).title("Title1").isConcept(false).reviewStatus(ReviewStatus.APPROVED).build();
        Post post2 = Post.builder().id(2L).title("Title2").isConcept(false).reviewStatus(ReviewStatus.APPROVED).build();
        when(postRepository.findAllByApprovedTrue()).thenReturn(Arrays.asList(post1, post2));

        // Act
        List<PostResponse> posts = postService.getAllPosts();

        // Assert
        assertEquals(2, posts.size());
        assertEquals("Title1", posts.get(0).getTitle());
        assertEquals("Title2", posts.get(1).getTitle());
    }

    @Test
    void testGetReviewedPost() {
        // Arrange
        ReviewPostRequest reviewRequest = new ReviewPostRequest(1L, ReviewStatus.APPROVED, "Good review");
        Post existingPost = Post.builder()
                .id(1L)
                .title("Title")
                .content("Content")
                .author("Author")
                .build();

        when(postRepository.findById(1L)).thenReturn(Optional.of(existingPost));

        // Act
        postService.getReviewedPost(reviewRequest);

        // Assert
        assertEquals(ReviewStatus.APPROVED, existingPost.getReviewStatus());
        assertEquals("Good review", existingPost.getReviewComment());
        verify(postRepository, times(1)).save(existingPost);
    }


    @Test
    void testGetPostsByAuthor() {
        // Arrange
        String author = "John Doe";
        List<Post> mockPosts = List.of(
                new Post(1L, "Title1", "Content1", author, LocalDateTime.now(), false, ReviewStatus.APPROVED, "Great post!"),
                new Post(2L, "Title2", "Content2", author, LocalDateTime.now(), true, ReviewStatus.PENDING, null)
        );
        when(postRepository.findByAuthor(author)).thenReturn(mockPosts);

        // Act
        List<PostResponse> responses = postService.getPostsByAuthor(author);

        // Assert
        assertNotNull(responses);
        assertEquals(2, responses.size());

        PostResponse response1 = responses.get(0);
        assertEquals(1L, response1.getId());
        assertEquals("Title1", response1.getTitle());
        assertEquals("Content1", response1.getContent());
        assertEquals(author, response1.getAuthor());
        assertNotNull(response1.getCreatedAt());
        assertFalse(response1.isConcept());
        assertEquals(ReviewStatus.APPROVED, response1.getReviewStatus());
        assertEquals("Great post!", response1.getComment());

        PostResponse response2 = responses.get(1);
        assertEquals(2L, response2.getId());
        assertEquals("Title2", response2.getTitle());
        assertEquals("Content2", response2.getContent());
        assertEquals(author, response2.getAuthor());
        assertNotNull(response2.getCreatedAt());
        assertTrue(response2.isConcept());
        assertEquals(ReviewStatus.PENDING, response2.getReviewStatus());
        assertNull(response2.getComment());

        // Verify
        verify(postRepository, times(1)).findByAuthor(author);
    }
}
