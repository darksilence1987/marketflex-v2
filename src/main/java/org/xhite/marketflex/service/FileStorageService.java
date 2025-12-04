package org.xhite.marketflex.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    public String store(MultipartFile file);
}
