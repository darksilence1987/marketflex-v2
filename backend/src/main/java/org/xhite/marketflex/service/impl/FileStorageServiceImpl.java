package org.xhite.marketflex.service.impl;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.xhite.marketflex.exception.StorageException;
import org.xhite.marketflex.service.FileStorageService;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileStorageServiceImpl implements FileStorageService {
    
    private final Path fileStorageLocation;
    private final String imageBaseUrl;
    private final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "gif");

    @PostConstruct
    public void init() {
        try {
            if (!Files.exists(fileStorageLocation)) {
                Files.createDirectories(fileStorageLocation);
                log.info("Created storage directory at: {}", fileStorageLocation);
            }
        } catch (IOException e) {
            throw new StorageException("Could not initialize storage", e);
        }
    }

    @Override
    public String store(MultipartFile file) {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        
        // Extract file extension properly
        String extension = getFileExtension(originalFilename)
            .orElseThrow(() -> new StorageException("File must have an extension"));

        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new StorageException("Only " + String.join(", ", ALLOWED_EXTENSIONS) + " files are allowed");
        }

        // Generate filename with proper extension
        String filename = UUID.randomUUID().toString() + "." + extension;

        try {
            if (file.isEmpty()) {
                throw new StorageException("Failed to store empty file " + filename);
            }

            // Normalize file name
            if (filename.contains("..")) {
                throw new StorageException(
                    "Cannot store file with relative path outside current directory "
                    + filename);
            }

            Path targetLocation = fileStorageLocation.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            String finalUrl = imageBaseUrl + "/" + filename;
            log.debug("Stored file at: {}", targetLocation);
            log.debug("Generated URL: {}", finalUrl);
            
            return finalUrl;

        } catch (IOException e) {
            throw new StorageException("Failed to store file " + filename, e);
        }
    }

    private Optional<String> getFileExtension(String filename) {
        return Optional.ofNullable(filename)
            .filter(f -> f.contains("."))
            .map(f -> f.substring(f.lastIndexOf(".") + 1));
    }
}
