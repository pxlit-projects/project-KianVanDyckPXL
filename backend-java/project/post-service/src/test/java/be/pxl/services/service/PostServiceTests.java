package be.pxl.services.service;

import be.pxl.services.controller.dto.PostRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.repository.PostRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.mockito.Mockito.verify;

class PostServiceTest {

    @Mock
    private PostRepository postRepository;

    @InjectMocks
    private PostService postService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void addPost_shouldSavePostWithCorrectValues() {
        // Arrange
        PostRequest postRequest = new PostRequest();
        postRequest.setTitle("Test Title");
        postRequest.setContent("Test Content");
        postRequest.setAuthor("Test Author");

        // Act
        postService.addPost(postRequest);

        // Assert
        ArgumentCaptor<Post> postCaptor = ArgumentCaptor.forClass(Post.class);
        verify(postRepository).save(postCaptor.capture());

        Post savedPost = postCaptor.getValue();
        assertEquals("Test Title", savedPost.getTitle());
        assertEquals("Test Content", savedPost.getContent());
        assertEquals("Test Author", savedPost.getAuthor());
    }

    @Test
    void addPost_shouldNotSavePostWithIncorrectValues() {
        // Arrange: set up a PostRequest with specific expected values
        PostRequest postRequest = new PostRequest();
        postRequest.setTitle("Expected Title");
        postRequest.setContent("Expected Content");
        postRequest.setAuthor("Expected Author");

        // Act
        postService.addPost(postRequest);

        // Assert: Capture the saved Post and check for incorrect values
        ArgumentCaptor<Post> postCaptor = ArgumentCaptor.forClass(Post.class);
        verify(postRepository).save(postCaptor.capture());
        Post savedPost = postCaptor.getValue();

        // Verify that incorrect values are NOT present in the saved post
        assertNotEquals("Wrong Title", savedPost.getTitle());
        assertNotEquals("Wrong Content", savedPost.getContent());
        assertNotEquals("Wrong Author", savedPost.getAuthor());
    }
}
