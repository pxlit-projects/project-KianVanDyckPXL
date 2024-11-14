package be.pxl.services.domain;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class PostTest {

    @Test
    void postBuilder_shouldSetAllFieldsCorrectly() {
        // Arrange
        LocalDateTime createdAt = LocalDateTime.now();

        // Act
        Post post = Post.builder()
                .title("Sample Title")
                .content("Sample Content")
                .author("Sample Author")
                .createdAt(createdAt)
                .build();

        // Assert
        assertEquals("Sample Title", post.getTitle());
        assertEquals("Sample Content", post.getContent());
        assertEquals("Sample Author", post.getAuthor());
        assertEquals(createdAt, post.getCreatedAt());
    }

    @Test
    void allArgsConstructor_shouldSetAllFieldsCorrectly() {
        // Arrange
        LocalDateTime createdAt = LocalDateTime.now();

        // Act
        Post post = new Post(1L, "Another Title", "Another Content", "Another Author", createdAt);

        // Assert
        assertEquals(1L, post.getId());
        assertEquals("Another Title", post.getTitle());
        assertEquals("Another Content", post.getContent());
        assertEquals("Another Author", post.getAuthor());
        assertEquals(createdAt, post.getCreatedAt());
    }

    @Test
    void noArgsConstructor_shouldInitializeWithDefaultValues() {
        // Act
        Post post = new Post();

        // Assert
        assertNotNull(post);  // Object should not be null
    }

    @Test
    void setters_shouldSetValuesCorrectly() {
        // Arrange
        Post post = new Post();
        LocalDateTime createdAt = LocalDateTime.now();

        // Act
        post.setId(2L);
        post.setTitle("Updated Title");
        post.setContent("Updated Content");
        post.setAuthor("Updated Author");
        post.setCreatedAt(createdAt);

        // Assert
        assertEquals(2L, post.getId());
        assertEquals("Updated Title", post.getTitle());
        assertEquals("Updated Content", post.getContent());
        assertEquals("Updated Author", post.getAuthor());
        assertEquals(createdAt, post.getCreatedAt());
    }
}
