package com.seafood.back.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface S3Service {
    public String saveImageToS3(MultipartFile imageFile, String fileName) throws IOException;
    public String getImageUrl(String key) throws IOException;
    public void deleteImageFromS3(String key) throws IOException;
}
