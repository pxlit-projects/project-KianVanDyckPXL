package be.pxl.services.controller.dto;

import jakarta.annotation.Nonnull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostReviewRequest {

    @Nonnull
    private long postId;
    @Nonnull
    private String title;
    @Nonnull
    private String content;
    @Nonnull
    private String author;
}
