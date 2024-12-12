package be.pxl.services.service;

import be.pxl.services.controller.dto.NotificationResponse;
import be.pxl.services.domain.Notification;
import be.pxl.services.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;


    public void createNotification(String message, String receiver) {
        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setTimestamp(LocalDateTime.now());
        notification.setReceiver(receiver);
        notificationRepository.save(notification);
    }


    public List<NotificationResponse> getNotifications(String author) {
        List<Notification> notifications = notificationRepository.findByReceiver(author);

        return notifications.stream().map(notification -> NotificationResponse.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .timestamp(notification.getTimestamp())
                .build()).toList();
    }
}
