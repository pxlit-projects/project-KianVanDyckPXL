package be.pxl.services.service;


import be.pxl.services.controller.dto.PostRequest;
import be.pxl.services.domain.Post;

public interface IPostService {

    void addPost(PostRequest postRequest);
}
