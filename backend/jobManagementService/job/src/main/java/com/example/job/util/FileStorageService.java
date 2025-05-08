package com.example.job.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private final String uploadDir;

    public FileStorageService(@Value("${file.upload-dir:./uploads}") String uploadDir) {
        this.uploadDir = uploadDir;
        try {
            Files.createDirectories(Paths.get(uploadDir, "photos"));
            Files.createDirectories(Paths.get(uploadDir, "videos"));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    public List<String> storePhotos(MultipartFile[] photos) throws IOException {
        List<String> fileNames = new ArrayList<>();
        if (photos == null || photos.length == 0) {
            return fileNames;
        }

        if (photos.length > 3) {
            throw new IllegalArgumentException("Maximum 3 photos allowed");
        }

        Path photoDir = Paths.get(uploadDir, "photos").toAbsolutePath().normalize();

        for (MultipartFile photo : photos) {
            if (photo != null && !photo.isEmpty()) {
                String fileName = UUID.randomUUID() + "_" + photo.getOriginalFilename();
                Path targetLocation = photoDir.resolve(fileName);
                Files.copy(photo.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
                fileNames.add(fileName);
            }
        }

        return fileNames;
    }

    public String storeVideo(MultipartFile video) throws IOException {
        if (video == null || video.isEmpty()) {
            return null;
        }

        // Check video size (simplified check)
        if (video.getSize() > 60 * 1024 * 1024) { // 60MB as a proxy for 60 seconds
            throw new IllegalArgumentException("Video cannot be longer than 60 seconds");
        }

        Path videoDir = Paths.get(uploadDir, "videos").toAbsolutePath().normalize();
        String fileName = UUID.randomUUID() + "_" + video.getOriginalFilename();
        Path targetLocation = videoDir.resolve(fileName);
        Files.copy(video.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }
}