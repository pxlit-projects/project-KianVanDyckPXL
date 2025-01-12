package be.pxl.services;

import be.pxl.services.controller.dto.CommentRequest;
import be.pxl.services.controller.dto.UpdateCommentRequest;
import be.pxl.services.domain.Comment;
import be.pxl.services.repository.CommentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Nonnull;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
public class CommentTests {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CommentRepository commentRepository;

    @Container
    private static MySQLContainer sqlContainer = new MySQLContainer("mysql:5.7.37");

    @BeforeEach
    public void setup() {
        commentRepository.deleteAll();
    }

    // Test for GET /api/comment/{postId}
    @Test
    public void testGetComments() throws Exception {
        long postId = 1L;

        // Simulate fetching comments for the post
        Comment comment = new Comment(1L, "This is a comment", "User", postId);
        commentRepository.save(comment);

        mockMvc.perform(get("/api/comment/{postId}", postId)
                        .header("Role", "USER"))
                .andExpect(status().isOk());
    }


    @Test
    public void testDeleteComment() throws Exception {
        long commentId = 1L;

        Comment comment = new Comment(1L, "This is a comment", "User", commentId);
        commentRepository.save(comment);

        mockMvc.perform(delete("/api/comment/{commentId}", commentId)
                        .header("Role", "ADMIN"))
                .andExpect(status().isOk());

        // Verify that the comment is actually deleted
        assert commentRepository.findById(commentId).isEmpty();
    }

    // Test for POST /api/comment
    @Test
    public void testAddComment() throws Exception {

        CommentRequest commentRequest = new CommentRequest( "This is a new comment", 1L,"User");

        mockMvc.perform(post("/api/comment")
                        .header("Role", "USER")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(commentRequest)))
                .andExpect(status().isCreated());

        List<Comment> comments = commentRepository.findAll();
        assert !comments.isEmpty();
    }


}
