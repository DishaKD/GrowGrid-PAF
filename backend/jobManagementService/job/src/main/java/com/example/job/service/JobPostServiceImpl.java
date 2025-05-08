package com.example.job.service;

import com.example.job.dto.JobPostRequest;
import com.example.job.dto.JobPostResponse;
import com.example.job.exception.ResourceNotFoundException;
import com.example.job.exception.ValidationException;
import com.example.job.model.JobPost;
import com.example.job.repository.JobPostRepository;
import com.example.job.util.FileStorageService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobPostServiceImpl implements JobPostService {

    private final JobPostRepository jobPostRepository;
    private final FileStorageService fileStorageService;

    public JobPostServiceImpl(JobPostRepository jobPostRepository, FileStorageService fileStorageService) {
        this.jobPostRepository = jobPostRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    public JobPostResponse createJobPost(JobPostRequest jobPostRequest, MultipartFile[] photos, MultipartFile video) {
        if (photos != null && photos.length > 3) {
            throw new ValidationException("Maximum 3 photos allowed");
        }

        JobPost jobPost = new JobPost();
        BeanUtils.copyProperties(jobPostRequest, jobPost);

        try {
            if (photos != null && photos.length > 0) {
                List<String> photoUrls = fileStorageService.storePhotos(photos);
                jobPost.setPhotoUrls(photoUrls);
            }

            if (video != null && !video.isEmpty()) {
                String videoUrl = fileStorageService.storeVideo(video);
                jobPost.setVideoUrl(videoUrl);
                jobPost.setVideoDuration(60); // Assuming we've processed and know the duration
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to store files", e);
        }

        JobPost savedJobPost = jobPostRepository.save(jobPost);
        return convertToJobPostResponse(savedJobPost);
    }

    @Override
    public JobPostResponse getJobPostById(Long id) {
        JobPost jobPost = findJobPostOrThrow(id);
        return convertToJobPostResponse(jobPost);
    }

    @Override
    public List<JobPostResponse> getAllJobPosts() {
        List<JobPost> jobPosts = jobPostRepository.findAll();
        return jobPosts.stream()
                .map(this::convertToJobPostResponse)
                .collect(Collectors.toList());
    }

    @Override
    public JobPostResponse updateJobPost(Long id, JobPostRequest jobPostRequest) {
        JobPost existingJobPost = findJobPostOrThrow(id);

        BeanUtils.copyProperties(jobPostRequest, existingJobPost);
        JobPost updatedJobPost = jobPostRepository.save(existingJobPost);

        return convertToJobPostResponse(updatedJobPost);
    }

    @Override
    public void deleteJobPost(Long id) {
        JobPost jobPost = findJobPostOrThrow(id);
        jobPostRepository.delete(jobPost);
    }

    @Override
    public JobPostResponse shareJobPost(Long id) {
        JobPost jobPost = findJobPostOrThrow(id);
        jobPost.incrementShareCount();
        JobPost updatedJobPost = jobPostRepository.save(jobPost);
        return convertToJobPostResponse(updatedJobPost);
    }

    private JobPost findJobPostOrThrow(Long id) {
        return jobPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job post not found with id: " + id));
    }

    private JobPostResponse convertToJobPostResponse(JobPost jobPost) {
        JobPostResponse response = new JobPostResponse();
        BeanUtils.copyProperties(jobPost, response);
        return response;
    }
}