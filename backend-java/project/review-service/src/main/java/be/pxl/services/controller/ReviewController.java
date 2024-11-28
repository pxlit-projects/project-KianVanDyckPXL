package be.pxl.services.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import be.pxl.services.service.IReviewService;

@RestController
@RequestMapping("api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final IReviewService reviewService;



    @PostMapping("/{postId}")
    public ResponseEntity<Void> addReview(@PathVariable Long postId) {
        try {
            reviewService.createReview(postId);
            System.out.println("i did it");
            return new ResponseEntity<>(HttpStatus.CREATED);
        }catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

}
