package com.postservice.postservice.Domain.dto.request;

import com.postservice.postservice.Domain.enums.NotificationType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationRequest {
    private String recipientUserId;
    private String senderUserId;
    private Long postId;
    private Long commentId;
    private NotificationType type;
}