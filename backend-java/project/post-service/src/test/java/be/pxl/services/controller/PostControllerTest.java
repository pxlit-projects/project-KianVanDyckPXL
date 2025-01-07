package be.pxl.services.controller;

import be.pxl.services.controller.dto.PostRequest;
import be.pxl.services.controller.dto.PostResponse;
import be.pxl.services.controller.dto.ReviewPostRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.domain.ReviewStatus;
import be.pxl.services.exceptions.ResourceNotFoundException;
import be.pxl.services.service.IPostService;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;



import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;


import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PostController.class)
class PostControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private IPostService postService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddPost_WithValidRole() throws Exception {
        // Arrange
        PostRequest postRequest = new PostRequest("Title", "Content", "Author", true);

        // Act & Assert
        mockMvc.perform(post("/api/post")
                        .header("Role", "ADMIN")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postRequest)))
                .andExpect(status().isCreated());

        verify(postService, times(1)).addPost(any(PostRequest.class));
    }

    @Test
    void testAddPost_WithInvalidRole() throws Exception {
        PostRequest postRequest = new PostRequest("Title", "Content", "Author", false);

        mockMvc.perform(post("/api/post")
                        .header("Role", "USER") // Invalid role for this endpoint
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(postRequest)))
                .andExpect(status().isForbidden()) // Expect forbidden response
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof SecurityException))
                .andExpect(result -> assertEquals("Access Denied: Insufficient permissions",
                        result.getResolvedException().getMessage()));
    }

    @Test
    void testUpdatePost_Success() throws Exception {
        // Arrange
        PostRequest postRequest = new PostRequest("Updated Title", "Updated Content", "Updated Author", false);
        Long postId = 1L;

        doNothing().when(postService).updatePost(postId, postRequest);

        // Act & Assert
        mockMvc.perform(put("/api/post/{id}", postId)
                        .header("Role", "EDITOR")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postRequest)))
                .andExpect(status().isCreated());

        verify(postService, times(1)).updatePost(postId, postRequest);
    }

    @Test
    void testUpdatePost_ResourceNotFound() throws Exception {
        // Arrange
        PostRequest postRequest = new PostRequest("Updated Title", "Updated Content", "Updated Author", false);
        Long postId = 1L;

        doThrow(new ResourceNotFoundException("Post not found")).when(postService).updatePost(postId, postRequest);

        // Act & Assert
        mockMvc.perform(put("/api/post/{id}", postId)
                        .header("Role", "EDITOR")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postRequest)))
                .andExpect(status().isNotFound());

        verify(postService, times(1)).updatePost(postId, postRequest);
    }

    @Test
    void testGetPost_Success() throws Exception {
        // Arrange
        Long postId = 1L;
        Post post = Post.builder()
                .id(postId)
                .title("Title")
                .content("Content")
                .author("Author")
                .createdAt(LocalDateTime.now())
                .isConcept(false)
                .build();

        when(postService.getPostById(postId)).thenReturn(post);

        // Act & Assert
        mockMvc.perform(get("/api/post/{id}", postId)
                        .header("Role", "USER"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(postId.intValue())))
                .andExpect(jsonPath("$.title", is("Title")))
                .andExpect(jsonPath("$.content", is("Content")))
                .andExpect(jsonPath("$.author", is("Author")));

        verify(postService, times(1)).getPostById(postId);
    }

    @Test
    void testGetAllPosts() throws Exception {
        // Arrange

        PostResponse post1 = new PostResponse(1L, "Title1", "Content1", "Author1", LocalDateTime.now(), false, ReviewStatus.PENDING, null);
        PostResponse post2 = new PostResponse(2L, "Title2", "Content2", "Author2", LocalDateTime.now(), false, ReviewStatus.PENDING, null);

        when(postService.getAllPosts()).thenReturn(Arrays.asList(post1, post2));

        // Act & Assert
        mockMvc.perform(get("/api/post")
                        .header("Role", "USER"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].title", is("Title1")))
                .andExpect(jsonPath("$[1].title", is("Title2")));

        verify(postService, times(1)).getAllPosts();
    }

    @Test
    void testGetPostsByAuthor_WithValidRoleAndExistingAuthor() throws Exception {
        String author = "Author1";
        String role = "ADMIN";

        List<PostResponse> mockPosts = List.of(
                new PostResponse(1L, "Title1", "Content1", author, LocalDateTime.now(), false, null, null),
                new PostResponse(2L, "Title2", "Content2", author, LocalDateTime.now(), false, null, null)
        );

        when(postService.getPostsByAuthor(author)).thenReturn(mockPosts);

        mockMvc.perform(get("/api/post/author/{author}", author)
                        .header("Role", role))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].title").value("Title1"))
                .andExpect(jsonPath("$[1].title").value("Title2"));

        verify(postService, times(1)).getPostsByAuthor(author);
    }

    @Test
    void testGetPostsByAuthor_WithInvalidRole() throws Exception {
        String author = "Author1";

        mockMvc.perform(get("/api/post/author/{author}", author)
                        .header("Role", "USER")) // Invalid role for this endpoint
                .andExpect(status().isForbidden())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof SecurityException))
                .andExpect(result -> assertEquals("Access Denied: Insufficient permissions",
                        result.getResolvedException().getMessage()));

        verify(postService, never()).getPostsByAuthor(anyString());
    }

    @Test
    void testGetPostsByAuthor_NoPostsForAuthor() throws Exception {
        String author = "Author2";
        String role = "ADMIN";

        when(postService.getPostsByAuthor(author)).thenReturn(List.of());

        mockMvc.perform(get("/api/post/author/{author}", author)
                        .header("Role", role))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));

        verify(postService, times(1)).getPostsByAuthor(author);
    }


    @Test
    void testPostReview_WithValidRequest() throws Exception {
        ReviewPostRequest reviewRequest = new ReviewPostRequest(1L, ReviewStatus.APPROVED, "Good content");

        doNothing().when(postService).getReviewedPost(any(ReviewPostRequest.class));

        mockMvc.perform(put("/api/post/review")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(reviewRequest)))
                .andExpect(status().isOk());

        verify(postService, times(1)).getReviewedPost(any(ReviewPostRequest.class));
    }

    @Test
    void testPostReview_WithInvalidRequest() throws Exception {
        ReviewPostRequest invalidRequest = new ReviewPostRequest(); // Missing required fields

        mockMvc.perform(put("/api/post/review")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());

        verify(postService, never()).getReviewedPost(any(ReviewPostRequest.class));
    }

}
