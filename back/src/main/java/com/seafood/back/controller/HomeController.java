package com.seafood.back.controller;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seafood.back.dto.CarouselDTO;
import com.seafood.back.dto.VideoDTO;
import com.seafood.back.service.HomeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/home")
@RequiredArgsConstructor
public class HomeController {

    private final HomeService homeService;

    
    @GetMapping("/getCarousel")
    public ResponseEntity<List<CarouselDTO>> getCarouselImageUrls() {
        List<CarouselDTO> carouselImages = homeService.getCarouselImageUrls();
        
        // // 캐시 지시자 max-age를 사용하여 리소스를 1시간 동안 캐시
        // CacheControl cacheControl = CacheControl.maxAge(1, TimeUnit.HOURS);
        
        return ResponseEntity.ok()
                // .cacheControl(cacheControl)
                .body(carouselImages);
    }
    
    @GetMapping("/getVideoPlayer")
    public VideoDTO getVideoPlayer() {
   
        return homeService.getVideoPlayer();
    }
}
