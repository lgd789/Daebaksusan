package com.seafood.back.config;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class S3Config {
  @Value("${aws.s3.bucket}")
  private String s3BucketName;
  
  @Value("${aws.s3.region}")
  private String s3Region;

  @Value("${aws.s3.access.key}")
  private String s3AccessKey;

  @Value("${aws.s3.secret.key}")
  private String s3SecretKey;

  @Bean
  public AmazonS3 amazonS3() {
    AWSCredentials credentials = new BasicAWSCredentials(s3AccessKey, s3SecretKey);

    return AmazonS3ClientBuilder
        .standard()
        .withCredentials(new AWSStaticCredentialsProvider(credentials))
        .withRegion(s3Region)
        .build();
  }

}