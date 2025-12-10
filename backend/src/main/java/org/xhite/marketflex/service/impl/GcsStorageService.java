package org.xhite.marketflex.service.impl;

import java.io.IOException;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.xhite.marketflex.exception.StorageException;
import org.xhite.marketflex.service.FileStorageService;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@ConditionalOnProperty(name = "storage.type", havingValue = "gcs")
public class GcsStorageService implements FileStorageService {

    @Value("${gcs.bucket-name}")
    private String bucketName;

    @Value("${gcs.project-id}")
    private String projectId;

    private Storage storage;
    
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "gif", "webp");
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    @PostConstruct
    public void init() {
        try {
            this.storage = StorageOptions.newBuilder()
                    .setProjectId(projectId)
                    .build()
                    .getService();
            log.info("GCS Storage initialized for bucket: {} in project: {}", bucketName, projectId);
        } catch (Exception e) {
            throw new StorageException("Failed to initialize GCS storage", e);
        }
    }

    @Override
    public String store(MultipartFile file) {
        if (file.isEmpty()) {
            throw new StorageException("Cannot store empty file");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new StorageException("File size exceeds maximum allowed size of 5MB");
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = getFileExtension(originalFilename)
                .orElseThrow(() -> new StorageException("File must have an extension"));

        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new StorageException("Only " + String.join(", ", ALLOWED_EXTENSIONS) + " files are allowed");
        }

        // Generate unique filename
        String filename = "products/" + UUID.randomUUID().toString() + "." + extension;

        try {
            BlobId blobId = BlobId.of(bucketName, filename);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                    .setContentType(file.getContentType())
                    .build();

            storage.create(blobInfo, file.getBytes());

            // Generate public URL
            String publicUrl = String.format("https://storage.googleapis.com/%s/%s", bucketName, filename);
            log.info("Uploaded file to GCS: {}", publicUrl);
            
            return publicUrl;

        } catch (IOException e) {
            throw new StorageException("Failed to upload file to GCS", e);
        }
    }

    @Override
    public void delete(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return;
        }

        // Only delete GCS files (those that match our bucket URL pattern)
        String gcsPrefix = String.format("https://storage.googleapis.com/%s/", bucketName);
        if (!imageUrl.startsWith(gcsPrefix)) {
            log.debug("Skipping delete for non-GCS URL: {}", imageUrl);
            return;
        }

        try {
            // Extract blob name from URL
            String blobName = imageUrl.substring(gcsPrefix.length());
            BlobId blobId = BlobId.of(bucketName, blobName);
            
            boolean deleted = storage.delete(blobId);
            if (deleted) {
                log.info("Deleted file from GCS: {}", imageUrl);
            } else {
                log.warn("File not found in GCS: {}", imageUrl);
            }
        } catch (Exception e) {
            log.warn("Failed to delete file from GCS: {}", imageUrl, e);
        }
    }

    private Optional<String> getFileExtension(String filename) {
        return Optional.ofNullable(filename)
                .filter(f -> f.contains("."))
                .map(f -> f.substring(f.lastIndexOf(".") + 1));
    }
}
