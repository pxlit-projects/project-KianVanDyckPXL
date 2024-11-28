package be.pxl.services.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Bean
    public Queue reviewQueue() {
        return new Queue("reviewQueue", false);
    }

    @Bean
    public DirectExchange postExchange() {
        return new DirectExchange("postExchange");
    }

    @Bean
    public Binding binding(Queue reviewQueue, DirectExchange postExchange) {
        return BindingBuilder.bind(reviewQueue).to(postExchange).with("reviewQueueRoutingKey");
    }
}