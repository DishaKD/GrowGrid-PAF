package com.example.job.service;

import com.example.job.dto.JobPostRequest;
import com.example.job.dto.JobPostResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface JobPostService {
    JobPostResponse createJobPost(JobPostRequest jobPostRequest, MultipartFile[] photos, MultipartFile video);
    JobPostResponse getJobPostById(Long id);
    List<JobPostResponse> getAllJobPosts();
    JobPostResponse updateJobPost(Long id, JobPostRequest jobPostRequest);
    void deleteJobPost(Long id);
    JobPostResponse shareJobPost(Long id);
}