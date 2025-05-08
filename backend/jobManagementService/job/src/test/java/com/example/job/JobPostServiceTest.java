package com.example.job;

import com.example.job.dto.JobPostRequest;
import com.example.job.dto.JobPostResponse;
import com.example.job.exception.ResourceNotFoundException;
import com.example.job.exception.ValidationException;
import com.example.job.model.JobPost;
import com.example.job.repository.JobPostRepository;
import com.example.job.service.JobPostServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.BeanUtils;
import org.springframework.mock.web.MockMultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class JobPostServiceTest {


    @Mock
    private JobPostRepository jobPostRepository;

    @InjectMocks
    private JobPostServiceImpl jobPostService;

    private JobPost testJobPost;
    private JobPostRequest testJobPostRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testJobPost = new JobPost();
        testJobPost.setId(1L);
        testJobPost.setTitle("Software Engineer");
        testJobPost.setDescription("Java developer position");
        testJobPost.setCompany("Tech Corp");
        testJobPost.setLocation("Remote");
        testJobPost.setEmploymentType("Full-time");
        testJobPost.setSalary(100000.0);
        testJobPost.setRequirements("5+ years of Java experience");
        testJobPost.setContactEmail("hr@techcorp.com");
        testJobPost.setShareCount(0);
        testJobPost.setPhotoUrls(Arrays.asList("photo1.jpg", "photo2.jpg"));
        testJobPost.setVideoUrl("video.mp4");
        testJobPost.setVideoDuration(30);

        testJobPostRequest = new JobPostRequest();
        testJobPostRequest.setTitle("Software Engineer");
        testJobPostRequest.setDescription("Java developer position");
        testJobPostRequest.setCompany("Tech Corp");
        testJobPostRequest.setLocation("Remote");
        testJobPostRequest.setEmploymentType("Full-time");
        testJobPostRequest.setSalary(100000.0);
        testJobPostRequest.setRequirements("5+ years of Java experience");
        testJobPostRequest.setContactEmail("hr@techcorp.com");
    }

    @Test
    void createJobPost_withValidFiles_shouldReturnResponseWithUrls() {
        MockMultipartFile[] photos = {
                new MockMultipartFile("photo", "photo1.jpg", "image/jpeg", "content".getBytes()),
                new MockMultipartFile("photo", "photo2.jpg", "image/jpeg", "content".getBytes())
        };
        MockMultipartFile video = new MockMultipartFile("video", "video.mp4", "video/mp4", "content".getBytes());

        when(jobPostRepository.save(any(JobPost.class))).thenReturn(testJobPost);

        JobPostResponse result = jobPostService.createJobPost(testJobPostRequest, photos, video);

        assertNotNull(result);
        assertEquals(2, result.getPhotoUrls().size());
        assertEquals("video.mp4", result.getVideoUrl());
        assertEquals(30, result.getVideoDuration());
    }

    @Test
    void createJobPost_withTooManyPhotos_shouldThrowException() {
        MockMultipartFile[] photos = new MockMultipartFile[4];
        for (int i = 0; i < 4; i++) {
            photos[i] = new MockMultipartFile("photo", "photo" + i + ".jpg", "image/jpeg", "content".getBytes());
        }
        MockMultipartFile video = new MockMultipartFile("video", "video.mp4", "video/mp4", "content".getBytes());

        assertThrows(ValidationException.class, () -> {
            jobPostService.createJobPost(testJobPostRequest, photos, video);
        });
    }

    @Test
    void createJobPost_withLongVideo_shouldThrowException() {
        MockMultipartFile[] photos = {
                new MockMultipartFile("photo", "photo1.jpg", "image/jpeg", "content".getBytes())
        };
        MockMultipartFile video = new MockMultipartFile("video", "video.mp4", "video/mp4", new byte[61 * 1024 * 1024]); // Simulate large file

        assertThrows(ValidationException.class, () -> {
            jobPostService.createJobPost(testJobPostRequest, photos, video);
        });
    }

    @Test
    void getJobPostById_withValidId_shouldReturnJobPostResponse() {
        when(jobPostRepository.findById(1L)).thenReturn(Optional.of(testJobPost));

        JobPostResponse result = jobPostService.getJobPostById(1L);

        assertNotNull(result);
        assertEquals(testJobPost.getId(), result.getId());
        assertEquals(testJobPost.getTitle(), result.getTitle());
    }

    @Test
    void getJobPostById_withInvalidId_shouldThrowException() {
        when(jobPostRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            jobPostService.getJobPostById(999L);
        });
    }

    @Test
    void getAllJobPosts_shouldReturnAllJobPosts() {
        JobPost secondJobPost = new JobPost();
        BeanUtils.copyProperties(testJobPost, secondJobPost);
        secondJobPost.setId(2L);
        secondJobPost.setTitle("Data Scientist");

        when(jobPostRepository.findAll()).thenReturn(Arrays.asList(testJobPost, secondJobPost));

        List<JobPostResponse> results = jobPostService.getAllJobPosts();

        assertNotNull(results);
        assertEquals(2, results.size());
        assertEquals("Software Engineer", results.get(0).getTitle());
        assertEquals("Data Scientist", results.get(1).getTitle());
    }

    @Test
    void updateJobPost_withValidId_shouldReturnUpdatedJobPost() {
        when(jobPostRepository.findById(1L)).thenReturn(Optional.of(testJobPost));
        
        testJobPostRequest.setTitle("Senior Software Engineer");
        testJobPostRequest.setSalary(120000.0);
        
        JobPost updatedJobPost = new JobPost();
        BeanUtils.copyProperties(testJobPost, updatedJobPost);
        updatedJobPost.setTitle("Senior Software Engineer");
        updatedJobPost.setSalary(120000.0);
        
        when(jobPostRepository.save(any(JobPost.class))).thenReturn(updatedJobPost);

        JobPostResponse result = jobPostService.updateJobPost(1L, testJobPostRequest);

        assertNotNull(result);
        assertEquals("Senior Software Engineer", result.getTitle());
        assertEquals(120000.0, result.getSalary());
    }

    @Test
    void deleteJobPost_withValidId_shouldDeleteSuccessfully() {
        when(jobPostRepository.findById(1L)).thenReturn(Optional.of(testJobPost));
        doNothing().when(jobPostRepository).delete(testJobPost);

        assertDoesNotThrow(() -> jobPostService.deleteJobPost(1L));
        verify(jobPostRepository, times(1)).delete(testJobPost);
    }

    @Test
    void shareJobPost_shouldIncrementShareCount() {
        when(jobPostRepository.findById(1L)).thenReturn(Optional.of(testJobPost));
        
        JobPost sharedJobPost = new JobPost();
        BeanUtils.copyProperties(testJobPost, sharedJobPost);
        sharedJobPost.setShareCount(1);
        
        when(jobPostRepository.save(any(JobPost.class))).thenReturn(sharedJobPost);

        JobPostResponse result = jobPostService.shareJobPost(1L);

        assertNotNull(result);
        assertEquals(1, result.getShareCount());
    }
}
