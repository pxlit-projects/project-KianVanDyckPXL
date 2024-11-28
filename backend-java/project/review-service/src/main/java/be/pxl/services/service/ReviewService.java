package be.pxl.services.service;

import be.pxl.services.domain.Review;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import be.pxl.services.repository.ReviewRepository;

@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService {
    private final ReviewRepository reviewRepository;


    @Override
    @RabbitListener(queues = "reviewQueue")
    public void createReview(Long postId) {
        Review review = new Review();
        review.setPostId(postId);
        reviewRepository.save(review);
    }

}
