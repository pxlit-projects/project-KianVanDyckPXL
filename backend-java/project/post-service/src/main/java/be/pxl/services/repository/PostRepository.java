package be.pxl.services.repository;

import be.pxl.services.domain.Post;
import be.pxl.services.service.PostService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p WHERE p.isConcept = false")
    List<Post> findAllByConceptIsFalse();

    List<Post> findByAuthor(String author);
}
