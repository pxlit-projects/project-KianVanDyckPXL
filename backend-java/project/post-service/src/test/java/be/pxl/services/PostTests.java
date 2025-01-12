package be.pxl.services;

import be.pxl.services.controller.dto.PostRequest;
import be.pxl.services.controller.dto.PostResponse;
import be.pxl.services.controller.dto.ReviewPostRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.domain.ReviewStatus;
import be.pxl.services.exceptions.ResourceNotFoundException;
import be.pxl.services.repository.PostRepository;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Nonnull;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.web.bind.annotation.*;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;




@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
public class PostTests {


    @Autowired
    MockMvc mockMvc;


    @MockBean
    private RabbitTemplate rabbitTemplate;


    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PostRepository postRepository;

    @Container
    private static MySQLContainer sqlContainer = new MySQLContainer("mysql:5.7.37");

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", sqlContainer::getJdbcUrl);
        registry.add("spring.datasource.username", sqlContainer::getUsername);
        registry.add("spring.datasource.password", sqlContainer::getPassword);
    }


    @BeforeEach
    public void setup() {
        postRepository.deleteAll();
    }

    @Test
    public void testGetPostById() throws Exception {
        Post post = new Post(1, "title", "content", "author", LocalDateTime.now(), true, ReviewStatus.PENDING, "comment");
        postRepository.save(post);

        mockMvc.perform(get("/api/post/" + post.getId())
                        .header("Role", "admin"))
                .andExpect(status().isOk());
    }


/*
    @Test
    public void testUpdatePost() throws Exception {

        Post post = new Post(1, "title", "content", "author", LocalDateTime.now(), true, ReviewStatus.PENDING, "comment");
        postRepository.save(post);


        PostRequest postRequest = new PostRequest("title", "updated content", "updated comment", true);


        mockMvc.perform(put("/api/post/1")
                        .header("Role", "admin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postRequest)))
                .andExpect(status().isCreated());


        Post updatedPost = postRepository.findById(post.getId()).orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        assertEquals("title", updatedPost.getTitle());
        assertEquals("updated content", updatedPost.getContent());
        assertEquals("updated comment", updatedPost.getAuthor());
    }
*/
    @Test
    public void testGetPostsByAuthor() throws Exception {
        Post post = new Post(1, "title", "content", "jef", LocalDateTime.now(), true, ReviewStatus.PENDING, "comment");
        postRepository.save(post);

        mockMvc.perform(get("/api/post/author/jef")
                        .header("Role", "admin"))
                .andExpect(status().isOk());
    }


    @Test
    public void testGetPostsByAll() throws Exception {
        Post post = new Post(1, "title", "content", "jef", LocalDateTime.now(), true, ReviewStatus.APPROVED, "comment");
        postRepository.save(post);

        mockMvc.perform(get("/api/post")
                        .header("Role", "admin"))
                .andExpect(status().isOk());
    }

    @Test
    public void testAddPost() throws Exception {
        // Given: a new post to be added
        PostRequest postRequest = new PostRequest("New Title", "New Content", "New Author", true);

        // When: sending a POST request to create the new post
        mockMvc.perform(post("/api/post")  // Endpoint for adding a post
                        .header("Role", "admin")  // Set the role header as required (admin or editor)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postRequest)))  // Convert postRequest to JSON
                .andExpect(status().isCreated());  // Expect a 201 Created response

        // Then: verify the post is actually added to the database
        Post savedPost = postRepository.findAll().stream()
                .filter(post -> post.getTitle().equals(postRequest.getTitle()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        assertEquals("New Title", savedPost.getTitle());
        assertEquals("New Content", savedPost.getContent());
        assertEquals("New Author", savedPost.getAuthor());
        assertTrue(savedPost.isConcept());  // Verify the concept flag
    }

}


