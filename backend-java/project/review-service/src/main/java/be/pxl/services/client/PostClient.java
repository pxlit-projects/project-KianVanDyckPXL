package be.pxl.services.client;

import be.pxl.services.controller.dto.ReviewPostRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "post-service")
public interface PostClient {

    @PutMapping("/api/post/review")
    void postReview(@RequestBody ReviewPostRequest reviewPostRequest);
}
