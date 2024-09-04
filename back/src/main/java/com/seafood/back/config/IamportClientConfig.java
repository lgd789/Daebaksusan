package com.seafood.back.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.siot.IamportRestClient.IamportClient;

@Configuration
public class IamportClientConfig {
    
    @Bean
    @Primary
    public IamportClient iamportClient(@Value("${iamport.key}") String restApiKey,
            @Value("${iamport.secret}") String restApiSecret) {
        return new IamportClient(restApiKey, restApiSecret);
    }
}
