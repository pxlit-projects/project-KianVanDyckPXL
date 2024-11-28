package be.pxl.services.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "review-service")
public interface ReviewClient {

    @PostMapping("api/reviews/{postId}")
    void createReview(@PathVariable long postId);
}
