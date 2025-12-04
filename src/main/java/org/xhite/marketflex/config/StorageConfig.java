package org.xhite.marketflex.config;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.xhite.marketflex.exception.StorageException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class StorageConfig {

    @Value("${app.upload.base-url}")
    private String imageBaseUrl;

    @Bean
    public Path fileStorageLocation() {
        try {
            // Create path in project's static directory
            String projectDir = System.getProperty("user.dir");
            Path uploadPath = Paths.get(projectDir, "src", "main", "resources", "static", "uploads");
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                log.info("Created upload directory at: {}", uploadPath);
            }
            
            return uploadPath;
        } catch (IOException e) {
            throw new StorageException("Could not initialize storage", e);
        }
    }

    @Bean
    public String imageBaseUrl() {
        return imageBaseUrl;
    }
}