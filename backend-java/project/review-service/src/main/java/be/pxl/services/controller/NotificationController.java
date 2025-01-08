package be.pxl.services.controller;

import be.pxl.services.controller.dto.NotificationResponse;
import be.pxl.services.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    private static final Logger log = LoggerFactory.getLogger(NotificationController.class);

    @GetMapping("/{author}")
    @CrossOrigin("*")
    public ResponseEntity<List<NotificationResponse>> getNotifications(@PathVariable String author) {
        try {
            log.info("Getting notifications for {}", author);
            return new ResponseEntity<>(notificationService.getNotifications(author), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
