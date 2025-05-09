package com.postservice.postservice.Domain.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
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

    public ResponseEntity<PostResponseDTO> getPostById(Long postId) {
        return postRepository.findById(postId)
                .map(post -> {
                    PostResponseDTO dto = mapToPostResponseDTO(post);
                    return ResponseEntity.ok(dto);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    public ResponseEntity<List<PostResponseDTO>> getPostsByUserId(String userId) {
        List<Post> posts = postRepository.findAllByUserId(userId);
        List<PostResponseDTO> responseDTOs = posts.stream().map(this::mapToPostResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseDTOs);
    }

    public ResponseEntity<PostResponseDTO> createPost(String description, String userId,
            List<MultipartFile> mediaFiles) {
        try {
            List<String> mediaUrls = new ArrayList<>();

            for (MultipartFile file : mediaFiles) {
                if (!file.isEmpty()) {
                    String filePath = saveFile(file);
                    if (filePath != null) {
                        mediaUrls.add(filePath);
                    }
                }
            }

            Post post = Post.builder()
                    .description(description)
                    .userId(userId)
                    .mediaUrls(mediaUrls)
                    .build();

            Post savedPost = postRepository.save(post);
            PostResponseDTO responseDTO = mapToPostResponseDTO(savedPost);

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    public ResponseEntity<PostResponseDTO> updatePost(Long postId, String description, List<MultipartFile> mediaFiles) {
        try {
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new RuntimeException("Post not found with ID: " + postId));

            post.setDescription(description);

            // Handle new media files (if provided)
            if (mediaFiles != null && !mediaFiles.isEmpty()) {
                List<String> mediaUrls = new ArrayList<>();
                for (MultipartFile file : mediaFiles) {
                    if (!file.isEmpty()) {
                        try {
                            String filePath = saveFile(file);
                            mediaUrls.add(filePath);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                }

                if (!mediaUrls.isEmpty()) {
                    post.setMediaUrls(mediaUrls);
                }
            }

            Post updatedPost = postRepository.save(post);
            PostResponseDTO responseDTO = mapToPostResponseDTO(updatedPost);
            return ResponseEntity.ok(responseDTO);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    public void deletePost(Long postId) {
        postRepository.deleteById(postId);
    }

    private String saveFile(MultipartFile file) throws IOException {
        String uploadDir = "uploads/";
        String originalFilename = file.getOriginalFilename();
        String fileName = UUID.randomUUID() + "_" + originalFilename;
        File uploadPath = new File(uploadDir);

        if (!uploadPath.exists()) {
            uploadPath.mkdirs();
        }

        Path filePath = Paths.get(uploadDir, fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return filePath.toString();
    }

    private PostResponseDTO mapToPostResponseDTO(Post post) {
        PostResponseDTO dto = new PostResponseDTO();
        dto.setId(post.getId());
        dto.setDescription(post.getDescription());
        dto.setMediaUrls(post.getMediaUrls());
        dto.setUserId(post.getUserId());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        return dto;
    }

}
