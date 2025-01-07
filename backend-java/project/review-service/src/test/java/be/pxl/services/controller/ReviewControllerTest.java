package be.pxl.services.controller;

import be.pxl.services.controller.dto.ReviewResponse;
import be.pxl.services.controller.dto.ReviewedPostRequest;
import be.pxl.services.domain.Review;
import be.pxl.services.exceptions.ResourceNotFoundException;
import be.pxl.services.service.IReviewService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ReviewControllerTest {

    private MockMvc mockMvc;

    @Mock
    private IReviewService reviewService;

    @InjectMocks
    private ReviewController reviewController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(reviewController).build();
    }

    @Test
    void testGetAllReviews_ValidRole() throws Exception {
        // Arrange
        List<ReviewResponse> reviews = Arrays.asList(new ReviewResponse(1L, "author", "desc", "title", 2L),new ReviewResponse(2L, "author", "desc", "title", 3L));
        when(reviewService.getAllReviews()).thenReturn(reviews);

        // Act & Assert
        mockMvc.perform(get("/api/reviews")
                        .header("Role", "ADMIN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0]").exists());

        verify(reviewService, times(1)).getAllReviews();
    }

    @Test
    void testGetAllReviews_InsufficientPermissions() throws Exception {
        // Act & Assert
        String invalidRole = "GUEST";

        mockMvc.perform(get("/api/reviews")
                        .header("Role", invalidRole))
                .andExpect(status().isForbidden());

        verify(reviewService, times(0)).getAllReviews();
    }

    @Test
    void testAddReview_ValidRole() throws Exception {
        // Arrange
        ReviewedPostRequest reviewedPostRequest = new ReviewedPostRequest();
        Review review = new Review();
        when(reviewService.updateReview(anyLong(), eq(reviewedPostRequest))).thenReturn(review);

        // Act & Assert
        mockMvc.perform(post("/api/reviews/1")
                        .header("Role", "ADMIN")
                        .contentType("application/json")
                        .content("{\"field\": \"value\"}")) // example JSON content
                .andExpect(status().isOk());

        verify(reviewService, times(1)).updateReview(eq(1L), eq(reviewedPostRequest));
    }

    @Test
    void testAddReview_ResourceNotFound() throws Exception {
        // Arrange
        ReviewedPostRequest reviewedPostRequest = new ReviewedPostRequest();
        when(reviewService.updateReview(anyLong(), eq(reviewedPostRequest)))
                .thenThrow(new ResourceNotFoundException("Resource not found"));

        // Act & Assert
        mockMvc.perform(post("/api/reviews/1")
                        .header("Role", "ADMIN")
                        .contentType("application/json")
                        .content("{\"field\": \"value\"}"))
                .andExpect(status().isNotFound());

        verify(reviewService, times(1)).updateReview(eq(1L), eq(reviewedPostRequest));
    }

    @Test
    void testAddReview_InsufficientPermissions() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/reviews/1")
                        .header("Role", "USER")
                        .contentType("application/json")
                        .content("{\"field\": \"value\"}"))
                .andExpect(status().isForbidden());

        verify(reviewService, times(0)).updateReview(anyLong(), any());
    }
}
