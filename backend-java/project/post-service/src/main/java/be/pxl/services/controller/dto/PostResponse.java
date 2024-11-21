package be.pxl.services.controller.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostResponse {

    private long id;

    private String title;
    private String content;
    private String author;
    private LocalDateTime createdAt;

    @JsonProperty("isConcept")
    private boolean isConcept;
}
