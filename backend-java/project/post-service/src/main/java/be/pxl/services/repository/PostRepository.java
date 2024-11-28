package be.pxl.services.repository;

import be.pxl.services.domain.Post;
import be.pxl.services.service.PostService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p WHERE p.reviewStatus = 'APPROVED' ")
    List<Post> findAllByApprovedTrue();

    List<Post> findByAuthor(String author);
}
