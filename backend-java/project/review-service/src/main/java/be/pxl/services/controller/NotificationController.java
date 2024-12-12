package be.pxl.services.controller;

import be.pxl.services.controller.dto.NotificationResponse;
import be.pxl.services.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/{author}")
    @CrossOrigin("*")
    public ResponseEntity<List<NotificationResponse>> getNotifications(@PathVariable String author) {
        try {
            return new ResponseEntity<>(notificationService.getNotifications(author), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
