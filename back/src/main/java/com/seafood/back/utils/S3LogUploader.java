// package com.seafood.back.utils;

// import com.amazonaws.services.s3.AmazonS3;
// import com.amazonaws.services.s3.model.ObjectMetadata;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.scheduling.annotation.Scheduled;
// import org.springframework.stereotype.Component;

// import java.io.File;
// import java.io.FileInputStream;
// import java.io.IOException;
// import java.util.Arrays;

// @Component
// public class S3LogUploader {

//     @Autowired
//     private AmazonS3 s3Client;

//     @Value("${aws.s3.bucket}")
//     private String bucketName;

//     @Scheduled(cron = "0 0 * * * *")
//     public void uploadLogsToS3() {
//         System.out.println("uploadLog");
//         uploadDirectory("logs/info", "logs/info/");
//         uploadDirectory("logs/warn", "logs/warn/");
//         uploadDirectory("logs/error", "logs/error/");
//     }

//     private void uploadDirectory(String dirPath, String s3Prefix) {
//         File dir = new File(dirPath);
//         if (dir.exists() && dir.isDirectory()) {
//             Arrays.stream(dir.listFiles()).forEach(file -> {
//                 try (FileInputStream fis = new FileInputStream(file)) {
//                     String s3Key = s3Prefix + file.getName();
//                     ObjectMetadata metadata = new ObjectMetadata();
//                     metadata.setContentLength(file.length());

//                     s3Client.putObject(bucketName, s3Key, fis, metadata);
//                     System.out.println("Uploaded: " + file.getName());
//                 } catch (IOException e) {
//                     e.printStackTrace();
//                 }
//             });
//         }
//     }
// }
