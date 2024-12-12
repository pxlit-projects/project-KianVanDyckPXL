package be.pxl.services.controller.dto;

import be.pxl.services.domain.ReviewStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
public record ReviewResponse(
    Long id, String author, String description, String title ,Long postId
) {}
