package be.pxl.services.controller.dto;

import be.pxl.services.domain.ReviewStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewPostRequest {
    private Long postId;
    private ReviewStatus status;
    private String comment;
}
