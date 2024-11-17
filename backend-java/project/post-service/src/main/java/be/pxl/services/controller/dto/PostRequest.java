package be.pxl.services.controller.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.Nonnull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostRequest {
    @Nonnull
    private String title;
    @Nonnull
    private String content;
    @Nonnull
    private String author;

    @JsonProperty("isConcept")
    private boolean isConcept;
}
