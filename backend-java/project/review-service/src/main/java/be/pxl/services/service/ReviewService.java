package be.pxl.services.service;

import be.pxl.services.client.PostClient;
import be.pxl.services.controller.dto.*;
import be.pxl.services.domain.Review;
import be.pxl.services.domain.ReviewStatus;
import be.pxl.services.exceptions.ResourceNotFoundException;
import be.pxl.services.repository.NotificationRepository;
import be.pxl.services.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService {

    private final ReviewRepository reviewRepository;
    private final PostClient postClient;
    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;

    @Override
    @RabbitListener(queues = "reviewQueue")
    public void createReview(PostReviewRequest postReviewRequest) {
        Review review = mapToReview(postReviewRequest);
        reviewRepository.save(review);
    }

    @Override
    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAllByReviewStatus_Pending().stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Review updateReview(Long id, ReviewedPostRequest reviewedPostRequest) throws ResourceNotFoundException {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));

        updateReviewDetails(review, reviewedPostRequest);

        Review savedReview = reviewRepository.save(review);

        notifyPostService(savedReview);
        notificationService.createNotification("Post with title: " + review.getTitle() + " has been " + review.getReviewStatus(), review.getAuthor());
        return savedReview;
    }

    private void updateReviewDetails(Review review, ReviewedPostRequest reviewedPostRequest) {
        ReviewStatus statusEnum = ReviewStatus.valueOf(reviewedPostRequest.getStatus());
        review.setReviewer(reviewedPostRequest.getReviewer());
        review.setComment(reviewedPostRequest.getComment());
        review.setReviewStatus(statusEnum);
    }

    private void notifyPostService(Review review) {
        ReviewPostRequest reviewPostRequest = ReviewPostRequest.builder()
                .postId(review.getPostId())
                .comment(review.getComment())
                .status(review.getReviewStatus())
                .build();
        postClient.postReview(reviewPostRequest);
    }



    private Review mapToReview(PostReviewRequest postReviewRequest) {
        return Review.builder()
                .postId(postReviewRequest.getPostId())
                .content(postReviewRequest.getContent())
                .author(postReviewRequest.getAuthor())
                .title(postReviewRequest.getTitle())
                .reviewStatus(ReviewStatus.PENDING)
                .build();
    }

    private ReviewResponse mapToReviewResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .title(review.getTitle())
                .description(review.getContent())
                .author(review.getAuthor())
                .postId(review.getPostId())
                .build();
    }


}
