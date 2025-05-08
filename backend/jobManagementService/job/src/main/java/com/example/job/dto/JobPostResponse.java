package com.example.job.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class JobPostResponse {
    private Long id;
    private String title;
    private String description;
    private String company;
    private String location;
    private String employmentType;
    private Double salary;
    private String requirements;
    private String contactEmail;
    private int shareCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<String> photoUrls;
    private String videoUrl;
    private Integer videoDuration;
}