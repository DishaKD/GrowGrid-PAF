package com.postservice.postservice.Domain.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.postservice.postservice.Domain.dto.response.PostResponseDTO;
import com.postservice.postservice.Domain.entity.Post;
import com.postservice.postservice.External.repository.PostRepository;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    public ResponseEntity<List<PostResponseDTO>> getPosts() {
        try {
            List<Post> posts = postRepository.findAll();

            if (posts.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            List<PostResponseDTO> responseDTOs = posts.stream().map(post -> {
                PostResponseDTO dto = new PostResponseDTO();
                dto.setId(post.getId());
                dto.setDescription(post.getDescription());
                dto.setMediaUrls(post.getMediaUrls());
                dto.setUserId(post.getUserId());
                dto.setCreatedAt(post.getCreatedAt());
                dto.setUpdatedAt(post.getUpdatedAt());
                return dto;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(responseDTOs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

}
