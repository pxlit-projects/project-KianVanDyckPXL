package be.pxl.services.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "review")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Long postId;
    private String reviewer;
    private String content;
    private String author;
    private String title;
    @Enumerated(EnumType.STRING)
    private ReviewStatus reviewStatus = ReviewStatus.PENDING;
    private String comment;


}
