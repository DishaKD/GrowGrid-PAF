package com.postservice.postservice.Application.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.postservice.postservice.Domain.dto.response.PostResponseDTO;
import com.postservice.postservice.Domain.service.PostService;
import lombok.AllArgsConstructor;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/posts")
@AllArgsConstructor
public class PostController {

    private PostService postService;

    @GetMapping("/")
    public ResponseEntity<List<PostResponseDTO>> getPosts() {
        return postService.getPosts();
    }

}
