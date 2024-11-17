package be.pxl.services.service;


import be.pxl.services.controller.dto.PostRequest;
import be.pxl.services.controller.dto.PostResponse;
import be.pxl.services.domain.Post;
import be.pxl.services.exceptions.ResourceNotFoundException;

import java.util.List;

public interface IPostService {

    void addPost(PostRequest postRequest);
    void updatePost(Long id,PostRequest postRequest) throws ResourceNotFoundException;

    Post getPostById(Long id) throws ResourceNotFoundException;

    List<Post> getAllPosts();
}
