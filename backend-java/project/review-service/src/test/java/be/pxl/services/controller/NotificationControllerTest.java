package be.pxl.services.controller;

import be.pxl.services.controller.dto.NotificationResponse;
import be.pxl.services.service.NotificationService;
import org.joda.time.DateTime;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(NotificationController.class)
class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private NotificationService notificationService;

    @Test
    void testGetNotifications_Success() throws Exception {
        // Arrange
        String author = "john.doe";
        List<NotificationResponse> mockNotifications = Arrays.asList(
                new NotificationResponse(1L, "Description 1", LocalDateTime.now()),
                new NotificationResponse(2L, "Description 2", LocalDateTime.now())
        );

        when(notificationService.getNotifications(author)).thenReturn(mockNotifications);




        // Act & Assert
        mockMvc.perform(get("/api/notifications/{author}", author)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].message").value("Description 1"));

    }

    @Test
    void testGetNotifications_BadRequest() throws Exception {
        // Arrange
        String author = "invalid-author";

        when(notificationService.getNotifications(author)).thenThrow(new RuntimeException("Bad request"));

        // Act & Assert
        mockMvc.perform(get("/api/notifications/{author}", author)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}
