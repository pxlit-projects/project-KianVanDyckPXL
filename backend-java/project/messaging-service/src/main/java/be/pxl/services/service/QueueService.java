package be.pxl.services.service;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class QueueService {

    @RabbitListener(queues = "myQueue")
    public void listen(String message) {
        System.out.println("Message read from myQueue: " + message);
    }
}