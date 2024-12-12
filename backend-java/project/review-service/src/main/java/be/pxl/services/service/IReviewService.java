package be.pxl.services.service;

import be.pxl.services.controller.dto.PostReviewRequest;
import be.pxl.services.controller.dto.ReviewResponse;
import be.pxl.services.controller.dto.ReviewedPostRequest;
import be.pxl.services.domain.Review;
import be.pxl.services.exceptions.ResourceNotFoundException;

import java.util.List;

public interface IReviewService {
    void createReview(PostReviewRequest postReviewRequest);

    List<ReviewResponse> getAllReviews();

    Review updateReview(Long id, ReviewedPostRequest reviewedPostRequest) throws ResourceNotFoundException;
}
