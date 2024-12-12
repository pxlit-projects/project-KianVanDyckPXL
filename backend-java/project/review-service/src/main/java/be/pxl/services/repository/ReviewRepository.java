package be.pxl.services.repository;

import be.pxl.services.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    @Query("SELECT r FROM Review r WHERE r.reviewStatus = 'PENDING' ")
    List<Review> findAllByReviewStatus_Pending();

    @Query("SELECT r FROM Review r WHERE r.id = :reviewId")
    Optional<Review> findById(@Param("reviewId") Long reviewId);

}
