package be.pxl.services.service;

import be.pxl.services.controller.dto.NotificationResponse;
import be.pxl.services.domain.Notification;
import be.pxl.services.repository.NotificationRepository;
import be.pxl.services.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.junit.jupiter.api.Assertions.assertEquals;


public class NotificationServiceTest {


    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationService notificationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }


    @Test
    void testCreateNotification() {
        // Arrange
        String message = "Test message";
        String receiver = "TestReceiver";

        // Act
        notificationService.createNotification(message, receiver);

        // Assert
        verify(notificationRepository).save(any(Notification.class));  // Verify that save is called
    }

    @Test
    void testGetNotifications() {
        // Arrange
        String author = "TestReceiver";
        Notification notification1 = new Notification();
        notification1.setId(1L);
        notification1.setMessage("Message 1");
        notification1.setTimestamp(LocalDateTime.now());
        notification1.setReceiver(author);

        Notification notification2 = new Notification();
        notification2.setId(2L);
        notification2.setMessage("Message 2");
        notification2.setTimestamp(LocalDateTime.now());
        notification2.setReceiver(author);

        when(notificationRepository.findByReceiver(author)).thenReturn(Arrays.asList(notification1, notification2));

        // Act
        List<NotificationResponse> notifications = notificationService.getNotifications(author);

        // Assert
        assertEquals(2, notifications.size());  // Verify we got 2 notifications
        assertEquals("Message 1", notifications.get(0).getMessage());  // Verify the message of the first notification
        assertEquals("Message 2", notifications.get(1).getMessage());  // Verify the message of the second notification
    }
}