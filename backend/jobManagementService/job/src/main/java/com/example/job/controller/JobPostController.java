package com.example.job.controller;

import com.example.job.dto.JobPostRequest;
import com.example.job.dto.JobPostResponse;
import com.example.job.service.JobPostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/job-posts")
@CrossOrigin(origins = "http://localhost:3002")
public class JobPostController {

    private final JobPostService jobPostService;

    @Autowired
    public JobPostController(JobPostService jobPostService) {
        this.jobPostService = jobPostService;
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<JobPostResponse> createJobPost(
            @RequestPart("jobPost") @Valid JobPostRequest jobPostRequest,
            @RequestPart(value = "photos", required = false) MultipartFile[] photos,
            @RequestPart(value = "video", required = false) MultipartFile video) {

        JobPostResponse newJobPost = jobPostService.createJobPost(jobPostRequest, photos, video);
        return new ResponseEntity<>(newJobPost, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobPostResponse> getJobPostById(@PathVariable Long id) {
        JobPostResponse jobPost = jobPostService.getJobPostById(id);
        return ResponseEntity.ok(jobPost);
    }

    @GetMapping
    public ResponseEntity<List<JobPostResponse>> getAllJobPosts() {
        List<JobPostResponse> jobPosts = jobPostService.getAllJobPosts();
        return ResponseEntity.ok(jobPosts);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobPostResponse> updateJobPost(
            @PathVariable Long id,
            @Valid @RequestBody JobPostRequest jobPostRequest) {
        JobPostResponse updatedJobPost = jobPostService.updateJobPost(id, jobPostRequest);
        return ResponseEntity.ok(updatedJobPost);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteJobPost(@PathVariable Long id) {
        jobPostService.deleteJobPost(id);
        Map<String, String> response = Map.of("message", "Job post deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/share")
    public ResponseEntity<JobPostResponse> shareJobPost(@PathVariable Long id) {
        JobPostResponse sharedJobPost = jobPostService.shareJobPost(id);
        return ResponseEntity.ok(sharedJobPost);
    }
}