package be.pxl.services.controller.dto;

import be.pxl.services.domain.ReviewStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewPostRequest {
    @NonNull
    private Long postId;
    private ReviewStatus status;
    private String comment;
}
