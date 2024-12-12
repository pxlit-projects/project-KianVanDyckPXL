package be.pxl.services.controller.dto;

import jakarta.annotation.Nonnull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Struct;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewedPostRequest {
    @Nonnull
    String reviewer;
    @Nonnull
    String status;
    String comment;
}
