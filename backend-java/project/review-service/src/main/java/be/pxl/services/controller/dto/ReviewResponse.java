package be.pxl.services.controller.dto;

import be.pxl.services.domain.ReviewStatus;

public record ReviewResponse(
    Long id, Long postId, String reviewer, ReviewStatus reviewStatus
) {}
