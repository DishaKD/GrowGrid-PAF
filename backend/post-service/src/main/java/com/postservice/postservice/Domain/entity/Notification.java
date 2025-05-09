package com.postservice.postservice.Domain.entity;

import com.postservice.postservice.Domain.enums.NotificationType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String recipientUserId;
    private String senderUserId;
    private Long postId;
    private Long commentId;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    @Column(name = "read_status")
    private Boolean read;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        read = false;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }
}
