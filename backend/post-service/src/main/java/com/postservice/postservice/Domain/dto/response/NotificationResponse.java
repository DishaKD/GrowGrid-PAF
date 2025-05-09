package com.postservice.postservice.Domain.dto.response;

import com.postservice.postservice.Domain.enums.NotificationType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {
    private Long id;
    private String recipientUserId;
    private String senderUserId;
    private Long postId;
    private Long commentId;
    private NotificationType type;
    private Boolean read;
    private LocalDateTime createdAt;
}