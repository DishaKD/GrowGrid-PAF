package com.postservice.postservice.Application.controllers;

import com.postservice.postservice.Domain.dto.request.CommentRequest;
import com.postservice.postservice.Domain.dto.response.CommentResponse;
import com.postservice.postservice.Domain.entity.Comment;
import com.postservice.postservice.External.repository.CommentRepository;

import lombok.AllArgsConstructor;

import org.hibernate.FetchNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/comments")
@AllArgsConstructor
public class CommentController {

    private final CommentRepository commentRepository;

    @PostMapping
    public ResponseEntity<CommentResponse> addComment(@RequestBody CommentRequest request) {
        Comment comment = Comment.builder()
                .content(request.getContent())
                .userId(request.getUserId())
                .postId(request.getPostId())
                .createdAt(LocalDateTime.now())
                .build();

        Comment saved = commentRepository.save(comment);

        return ResponseEntity.ok(toDto(saved));
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentResponse>> getCommentsByPost(@PathVariable Long postId) {
        List<CommentResponse> comments = commentRepository.findByPostId(postId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(comments);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(@PathVariable Long id, @RequestBody CommentRequest request) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new FetchNotFoundException("Comment", id));

        comment.setContent(request.getContent());
        comment.setUpdatedAt(LocalDateTime.now());

        Comment updatedComment = commentRepository.save(comment);
        return ResponseEntity.ok(updatedComment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private CommentResponse toDto(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .userId(comment.getUserId())
                .postId(comment.getPostId())
                .createdAt(comment.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME))
                .build();
    }
}