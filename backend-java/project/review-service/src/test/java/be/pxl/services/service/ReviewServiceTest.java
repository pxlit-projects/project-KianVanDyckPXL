package be.pxl.services.service;

import be.pxl.services.client.PostClient;
import be.pxl.services.controller.dto.*;
import be.pxl.services.domain.Review;
import be.pxl.services.domain.ReviewStatus;
import be.pxl.services.exceptions.ResourceNotFoundException;
import be.pxl.services.repository.NotificationRepository;
import be.pxl.services.repository.ReviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ReviewServiceTest {

    private ReviewService reviewService;

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private PostClient postClient;

    @Mock
    private NotificationService notificationService;

    @Mock
    private NotificationRepository notificationRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        reviewService = new ReviewService(reviewRepository, postClient, notificationService, notificationRepository);
    }

    @Test
    void testCreateReview() {
        // Arrange
        PostReviewRequest postReviewRequest = new PostReviewRequest(1L, "Test Title", "Test Content", "Author");

        // Act
        reviewService.createReview(postReviewRequest);

        // Assert
        ArgumentCaptor<Review> captor = ArgumentCaptor.forClass(Review.class);
        verify(reviewRepository).save(captor.capture());
        Review savedReview = captor.getValue();

        assertEquals("Test Title", savedReview.getTitle());
        assertEquals("Test Content", savedReview.getContent());
        assertEquals("Author", savedReview.getAuthor());
        assertEquals(ReviewStatus.PENDING, savedReview.getReviewStatus());
    }

    @Test
    void testGetAllReviews() {
        // Arrange
        Review review1 = Review.builder().id(1L).title("Title 1").content("Content 1").author("Author 1").build();
        Review review2 = Review.builder().id(2L).title("Title 2").content("Content 2").author("Author 2").build();
        when(reviewRepository.findAllByReviewStatus_Pending()).thenReturn(Arrays.asList(review1, review2));

        // Act
        List<ReviewResponse> reviews = reviewService.getAllReviews();

        // Assert
        assertEquals(2, reviews.size());
        assertEquals("Title 1", reviews.get(0).title());
        assertEquals("Content 1", reviews.get(0).description());
        assertEquals("Author 1", reviews.get(0).author());
    }

    @Test
    void testUpdateReview_Success() throws ResourceNotFoundException {
        // Arrange
        Long reviewId = 1L;
        ReviewedPostRequest reviewedPostRequest = new ReviewedPostRequest( "Reviewer", "APPROVED", "Good content");

        Review existingReview = Review.builder()
                .id(reviewId)
                .postId(10L)
                .title("Old Title")
                .author("Author")
                .reviewStatus(ReviewStatus.PENDING)
                .build();

        when(reviewRepository.findById(reviewId)).thenReturn(Optional.of(existingReview));
        when(reviewRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Review updatedReview = reviewService.updateReview(reviewId, reviewedPostRequest);

        // Assert
        assertEquals(ReviewStatus.APPROVED, updatedReview.getReviewStatus());
        assertEquals("Reviewer", updatedReview.getReviewer());
        assertEquals("Good content", updatedReview.getComment());

        verify(postClient).postReview(any(ReviewPostRequest.class));
        verify(notificationService).createNotification(anyString(), eq("Author"));
    }

    @Test
    void testUpdateReview_ResourceNotFound() {
        // Arrange
        Long reviewId = 1L;
        ReviewedPostRequest reviewedPostRequest = new ReviewedPostRequest( "Reviewer", "APPROVED", "Good content");

        when(reviewRepository.findById(reviewId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> reviewService.updateReview(reviewId, reviewedPostRequest));
    }
}
