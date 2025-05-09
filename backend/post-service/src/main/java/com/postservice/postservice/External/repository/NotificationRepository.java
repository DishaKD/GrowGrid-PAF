package com.postservice.postservice.External.repository;

import com.postservice.postservice.Domain.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByRecipientUserIdOrderByCreatedAtDesc(String recipientUserId);

    List<Notification> findByRecipientUserIdAndReadFalseOrderByCreatedAtDesc(String recipientUserId);

    List<Notification> findByRecipientUserId(String recipientUserId);

}