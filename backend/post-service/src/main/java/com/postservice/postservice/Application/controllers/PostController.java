package com.postservice.postservice.Application.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.postservice.postservice.External.repository.PostRepository;
import lombok.AllArgsConstructor;
import java.util.Optional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/posts")
@AllArgsConstructor
public class PostController {

    private PostRepository postRepository;

    @GetMapping("/")
    public String getPosts() {
        Optional<String> posts = postRepository.findAll().stream()
                .map(post -> post.getDescription())
                .reduce((first, second) -> first + ", " + second);
        return posts.orElse("No posts found");
    }

    @PostMapping("/add")
    public String postMethodName(@RequestBody String entity) {
        
        return entity;
    }
    
    
    
}
