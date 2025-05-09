package com.postservice.postservice.Application.controllers;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.postservice.postservice.Domain.dto.request.NotificationRequest;
import com.postservice.postservice.Domain.dto.response.NotificationResponse;
import com.postservice.postservice.Domain.entity.Notification;
import com.postservice.postservice.External.repository.NotificationRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<List<NotificationResponse>> getAllNotificationsForUser(@PathVariable String userId) {
        List<Notification> notifications = notificationRepository
                .findByRecipientUserIdOrderByCreatedAtDesc(userId);

        List<NotificationResponse> response = notifications.stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<NotificationResponse> createNotification(@RequestBody NotificationRequest request) {
        Notification notification = Notification.builder()
                .recipientUserId(request.getRecipientUserId())
                .senderUserId(request.getSenderUserId())
                .postId(request.getPostId())
                .commentId(request.getCommentId())
                .type(request.getType())
                .build();

        Notification saved = notificationRepository.save(notification);

        return ResponseEntity.ok(toDto(saved));
    }

    @GetMapping("/unread/{userId}")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotificationsForUser(@PathVariable String userId) {
        List<Notification> notifications = notificationRepository
                .findByRecipientUserIdAndReadFalseOrderByCreatedAtDesc(userId);

        List<NotificationResponse> response = notifications.stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/mark-as-read/{notificationId}")
    public ResponseEntity<NotificationResponse> markNotificationAsRead(@PathVariable Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found with ID: " + notificationId));

        notification.setRead(true);
        notificationRepository.save(notification);

        return ResponseEntity.ok(toDto(notification));
    }

    @PutMapping("/mark-all-read/{userId}")
    public ResponseEntity<List<NotificationResponse>> markAllAsRead(@PathVariable String userId) {
        List<Notification> notifications = notificationRepository.findByRecipientUserId(userId);
        notifications.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(notifications);

        List<NotificationResponse> response = notifications.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    private NotificationResponse toDto(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .recipientUserId(notification.getRecipientUserId())
                .senderUserId(notification.getSenderUserId())
                .postId(notification.getPostId())
                .commentId(notification.getCommentId())
                .type(notification.getType())
                .read(notification.getRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }

}