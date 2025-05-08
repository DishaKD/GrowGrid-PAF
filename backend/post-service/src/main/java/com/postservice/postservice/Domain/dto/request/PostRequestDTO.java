package com.postservice.postservice.Domain.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostRequestDTO {
    private String userId;
    private String description;
    private List<String> mediaUrls;

}
