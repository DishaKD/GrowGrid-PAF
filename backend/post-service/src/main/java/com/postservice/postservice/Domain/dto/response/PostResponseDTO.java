package com.postservice.postservice.Domain.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class PostResponseDTO {
    private Long id;
    private String description;
    private List<String> mediaUrls;
    private String userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
