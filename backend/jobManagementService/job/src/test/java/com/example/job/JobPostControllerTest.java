package com.example.job;

import com.example.job.controller.JobPostController;
import com.example.job.dto.JobPostRequest;
import com.example.job.dto.JobPostResponse;
import com.example.job.service.JobPostService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class JobPostControllerTest {

    private MockMvc mockMvc;

    @Mock
    private JobPostService jobPostService;

    @InjectMocks
    private JobPostController jobPostController;

    private ObjectMapper objectMapper;
    private JobPostRequest jobPostRequest;
    private JobPostResponse jobPostResponse;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(jobPostController).build();
        objectMapper = new ObjectMapper();

        jobPostRequest = new JobPostRequest();
        jobPostRequest.setTitle("Software Engineer");
        jobPostRequest.setDescription("Java developer position");
        jobPostRequest.setCompany("Tech Corp");
        jobPostRequest.setLocation("Remote");
        jobPostRequest.setEmploymentType("Full-time");
        jobPostRequest.setSalary(100000.0);
        jobPostRequest.setRequirements("5+ years of Java experience");
        jobPostRequest.setContactEmail("hr@techcorp.com");

        jobPostResponse = new JobPostResponse();
        jobPostResponse.setId(1L);
        jobPostResponse.setTitle("Software Engineer");
        jobPostResponse.setDescription("Java developer position");
        jobPostResponse.setCompany("Tech Corp");
        jobPostResponse.setLocation("Remote");
        jobPostResponse.setEmploymentType("Full-time");
        jobPostResponse.setSalary(100000.0);
        jobPostResponse.setRequirements("5+ years of Java experience");
        jobPostResponse.setContactEmail("hr@techcorp.com");
        jobPostResponse.setShareCount(0);
        jobPostResponse.setCreatedAt(LocalDateTime.now());
        jobPostResponse.setUpdatedAt(LocalDateTime.now());
        jobPostResponse.setPhotoUrls(Arrays.asList("photo1.jpg", "photo2.jpg"));
        jobPostResponse.setVideoUrl("video.mp4");
        jobPostResponse.setVideoDuration(30);
    }

    @Test
    void createJobPost_shouldReturnCreatedJobPost() throws Exception {
        MockMultipartFile photo1 = new MockMultipartFile(
                "photos", "photo1.jpg", "image/jpeg", "content".getBytes());
        MockMultipartFile photo2 = new MockMultipartFile(
                "photos", "photo2.jpg", "image/jpeg", "content".getBytes());
        MockMultipartFile video = new MockMultipartFile(
                "video", "video.mp4", "video/mp4", "content".getBytes());
        MockMultipartFile data = new MockMultipartFile(
                "jobPost", "", "application/json",
                objectMapper.writeValueAsString(jobPostRequest).getBytes());

        when(jobPostService.createJobPost(any(JobPostRequest.class), any(), any()))
                .thenReturn(jobPostResponse);

        mockMvc.perform(multipart("/api/v1/job-posts")
                        .file(data)
                        .file(photo1)
                        .file(photo2)
                        .file(video))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is("Software Engineer")))
                .andExpect(jsonPath("$.photoUrls", hasSize(2)))
                .andExpect(jsonPath("$.videoUrl", is("video.mp4")));

        verify(jobPostService, times(1)).createJobPost(
                any(JobPostRequest.class), any(), any());
    }

    @Test
    void getJobPostById_shouldReturnJobPost() throws Exception {
        when(jobPostService.getJobPostById(1L)).thenReturn(jobPostResponse);

        mockMvc.perform(get("/api/v1/job-posts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is("Software Engineer")))
                .andExpect(jsonPath("$.photoUrls", hasSize(2)))
                .andExpect(jsonPath("$.videoUrl", is("video.mp4")));

        verify(jobPostService, times(1)).getJobPostById(1L);
    }

    @Test
    void getAllJobPosts_shouldReturnAllJobPosts() throws Exception {
        JobPostResponse secondJobPost = new JobPostResponse();
        secondJobPost.setId(2L);
        secondJobPost.setTitle("Data Scientist");

        List<JobPostResponse> jobPosts = Arrays.asList(jobPostResponse, secondJobPost);
        when(jobPostService.getAllJobPosts()).thenReturn(jobPosts);

        mockMvc.perform(get("/api/v1/job-posts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].title", is("Software Engineer")))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].title", is("Data Scientist")));

        verify(jobPostService, times(1)).getAllJobPosts();
    }

    @Test
    void updateJobPost_shouldReturnUpdatedJobPost() throws Exception {
        jobPostRequest.setTitle("Senior Software Engineer");

        JobPostResponse updatedResponse = new JobPostResponse();
        updatedResponse.setId(1L);
        updatedResponse.setTitle("Senior Software Engineer");
        updatedResponse.setDescription("Java developer position");
        updatedResponse.setCompany("Tech Corp");

        when(jobPostService.updateJobPost(eq(1L), any(JobPostRequest.class))).thenReturn(updatedResponse);

        mockMvc.perform(put("/api/v1/job-posts/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(jobPostRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is("Senior Software Engineer")));

        verify(jobPostService, times(1)).updateJobPost(eq(1L), any(JobPostRequest.class));
    }

    @Test
    void deleteJobPost_shouldReturnSuccessMessage() throws Exception {
        doNothing().when(jobPostService).deleteJobPost(1L);

        mockMvc.perform(delete("/api/v1/job-posts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Job post deleted successfully")));

        verify(jobPostService, times(1)).deleteJobPost(1L);
    }

    @Test
    void shareJobPost_shouldReturnSharedJobPost() throws Exception {
        JobPostResponse sharedJobPost = new JobPostResponse();
        sharedJobPost.setId(1L);
        sharedJobPost.setTitle("Software Engineer");
        sharedJobPost.setShareCount(1);

        when(jobPostService.shareJobPost(1L)).thenReturn(sharedJobPost);

        mockMvc.perform(post("/api/v1/job-posts/1/share"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.shareCount", is(1)));

        verify(jobPostService, times(1)).shareJobPost(1L);
    }
}
