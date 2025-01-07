package be.pxl.services.controller;

import be.pxl.services.controller.dto.CommentRequest;
import be.pxl.services.controller.dto.UpdateCommentRequest;
import be.pxl.services.domain.Comment;
import be.pxl.services.service.CommentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CommentController.class)
class CommentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CommentService commentService;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        Mockito.reset(commentService);
    }

    @Test
    void getComments_ShouldReturnListOfComments_WhenRoleIsValid() throws Exception {
        long postId = 1L;
        String role = "ADMIN";
        List<Comment> comments = Arrays.asList(
                new Comment(1L, "Comment 1", "Author 1", postId),
                new Comment(2L, "Comment 2", "Author 2", postId)
        );

        Mockito.when(commentService.getComments(postId)).thenReturn(comments);

        mockMvc.perform(get("/api/comment/{postId}", postId)
                        .header("Role", role))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].comment").value("Comment 1"))
                .andExpect(jsonPath("$[0].author").value("Author 1"))
                .andExpect(jsonPath("$[1].id").value(2L))
                .andExpect(jsonPath("$[1].comment").value("Comment 2"))
                .andExpect(jsonPath("$[1].author").value("Author 2"));
    }

    @Test
    void deleteComment_ShouldCallService_WhenRoleIsValid() throws Exception {
        long commentId = 1L;
        String role = "EDITOR";

        mockMvc.perform(delete("/api/comment/{commentId}", commentId)
                        .header("Role", role))
                .andExpect(status().isOk());

        Mockito.verify(commentService).deleteComment(commentId);
    }

    @Test
    void addComment_ShouldCallServiceAndReturnCreated_WhenRoleIsValid() throws Exception {
        String role = "USER";
        CommentRequest request = new CommentRequest("New Comment", 1L, "author");

        mockMvc.perform(post("/api/comment")
                        .header("Role", role)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        Mockito.verify(commentService).addComment(any(CommentRequest.class));
    }

    @Test
    void updateComment_ShouldCallService_WhenRoleIsValid() throws Exception {
        long commentId = 1L;
        String role = "USER";
        UpdateCommentRequest request = new UpdateCommentRequest("Updated Comment");

        mockMvc.perform(put("/api/comment/{commentId}", commentId)
                        .header("Role", role)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        Mockito.verify(commentService).updateComment(eq(commentId), any(UpdateCommentRequest.class));
    }

    @Test
    void shouldReturnForbidden_WhenRoleIsInvalid() throws Exception {
        String invalidRole = "GUEST";
        long postId = 1L;

        mockMvc.perform(get("/api/comment/{postId}", postId)
                        .header("Role", invalidRole))
                .andExpect(status().isForbidden())
                .andExpect(content().string("Access Denied: Insufficient permissions"));
    }
}
