package be.pxl.services.repository;

import be.pxl.services.domain.Post;
import be.pxl.services.service.PostService;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}
