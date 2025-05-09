package com.postservice.postservice.Application.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.postservice.postservice.Domain.dto.response.PostResponseDTO;
import com.postservice.postservice.Domain.service.PostService;
import lombok.AllArgsConstructor;
import com.postservice.postservice.Domain.service.FileStorageService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor
public class PostController {

    private PostService postService;
    private FileStorageService fileStorageService;

    @PostMapping("/")
    public ResponseEntity<PostResponseDTO> createPost(
            @RequestParam String description,
            @RequestParam String userId,
            @RequestParam List<MultipartFile> mediaFiles) {
        return postService.createPost(description, userId, mediaFiles);
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        String filePath = fileStorageService.storeFile(file);
        return ResponseEntity.ok(filePath);
    }

    @GetMapping("/")
    public ResponseEntity<List<PostResponseDTO>> getPosts() {
        return postService.getPosts();
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostResponseDTO> getPostById(@PathVariable Long postId) {
        return postService.getPostById(postId);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostResponseDTO>> getPostsByUserId(@PathVariable String userId) {
        return postService.getPostsByUserId(userId);
    }

    @PutMapping("/{postId}")
    public ResponseEntity<PostResponseDTO> updatePost(
            @PathVariable Long postId,
            @RequestParam String description,
            @RequestParam List<MultipartFile> mediaFiles) {
        return postService.updatePost(postId, description, mediaFiles);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        postService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }

}
