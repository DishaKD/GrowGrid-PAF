package com.postservice.postservice.Domain.dto.request;

import lombok.Data;

@Data
public class CommentRequest {
    private String content;
    private String userId;
    private Long postId;
}
