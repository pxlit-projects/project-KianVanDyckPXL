package be.pxl.services.controller;

import be.pxl.services.controller.dto.ReviewResponse;
import be.pxl.services.controller.dto.ReviewedPostRequest;
import be.pxl.services.domain.Review;
import be.pxl.services.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
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

    private void validateRole(String role) {
        if (!"ADMIN".equalsIgnoreCase(role) && !"EDITOR".equalsIgnoreCase(role)) {
            throw new SecurityException("Access Denied: Insufficient permissions");
        }
    }

    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getAllReviews(@RequestHeader("Role") String role) {

        try {
            validateRole(role);
            return new ResponseEntity<>(reviewService.getAllReviews(), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/{id}")
    public ResponseEntity<Review> addReview(@RequestHeader("Role") String role, @PathVariable Long id, @RequestBody ReviewedPostRequest reviewedPostRequest) {
        try {
            validateRole(role);
            return new ResponseEntity<>(reviewService.updateReview(id, reviewedPostRequest), HttpStatus.OK);
        }catch (ResourceNotFoundException e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        catch (Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

}
