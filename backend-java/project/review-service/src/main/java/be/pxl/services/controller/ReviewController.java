package be.pxl.services.controller;

import be.pxl.services.controller.dto.ReviewResponse;
import be.pxl.services.controller.dto.ReviewedPostRequest;
import be.pxl.services.domain.Review;
import be.pxl.services.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import be.pxl.services.service.IReviewService;

import java.util.List;

@RestController
@RequestMapping("api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {

    private final IReviewService reviewService;
    private static final Logger log = LoggerFactory.getLogger(ReviewController.class);

    private void validateRole(String role) {
        if (!"ADMIN".equalsIgnoreCase(role) && !"EDITOR".equalsIgnoreCase(role)) {
            throw new SecurityException("Access Denied: Insufficient permissions");
        }
    }

    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getAllReviews(@RequestHeader("Role") String role) {

        try {
            validateRole(role);
            List<ReviewResponse> responses = reviewService.getAllReviews();
            log.info("a person got all the reviews: {}", responses);
            return new ResponseEntity<>(responses, HttpStatus.OK);
        }catch (SecurityException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        catch (Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/{id}")
    public ResponseEntity<Review> addReview(@RequestHeader("Role") String role, @PathVariable Long id, @RequestBody ReviewedPostRequest reviewedPostRequest) {
        try {
            validateRole(role);
            Review updatedReview = reviewService.updateReview(id, reviewedPostRequest);
            log.info("a person updated a review: {}", updatedReview);
            return new ResponseEntity<>(updatedReview, HttpStatus.OK);
        }catch (ResourceNotFoundException e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        catch (SecurityException e){
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        catch (Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

}
