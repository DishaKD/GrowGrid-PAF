package com.postservice.postservice.Domain.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.postservice.postservice.Domain.config.FileStorageProperties;

import java.io.IOException;
import java.nio.file.*;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageService(FileStorageProperties fileStorageProperties) {
        this.fileStorageLocation = Paths.get(fileStorageProperties.getUploadDir())
                .toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create upload directory.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            if (fileName.contains("..")) {
                throw new RuntimeException("Invalid file path.");
            }

            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/" + fileName; // accessible via static resource mapping
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file: " + fileName, ex);
        }
    }
}
