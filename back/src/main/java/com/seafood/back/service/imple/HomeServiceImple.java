package com.seafood.back.service.imple;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.seafood.back.dto.CarouselDTO;
import com.seafood.back.dto.ProductDTO;
import com.seafood.back.dto.VideoDTO;
import com.seafood.back.entity.CarouselEntity;
import com.seafood.back.entity.PromotionalVideoEntity;
import com.seafood.back.respository.CarouselsRepository;
import com.seafood.back.respository.VideoRepository;
import com.seafood.back.service.HomeService;
import com.seafood.back.service.ProductService;
import com.seafood.back.service.S3Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class HomeServiceImple implements HomeService {

    private final ProductService productService;
    private final S3Service s3Service;

    private final CarouselsRepository carouselsRepository;
    private final VideoRepository videoRepository;

    
    @Override
    // @Cacheable(value = "carouselCache")
    public List<CarouselDTO> getCarouselImageUrls() {
        List<CarouselEntity> carousels = carouselsRepository.findAll();
        return carousels.stream()
                .map(CarouselDTO::fromEntity)
                .collect(Collectors.toList());
        // carousels.forEach(carousel -> {
        //     try {
        //         String imageUrl = s3Service.getImageUrl(carousel.getImageUrl());
        //         carousel.setImageUrl(imageUrl);
        //     } catch (IOException e) {
        
        //         e.printStackTrace();
        //     }
        // });

        // return carousels;
    }

    @Override
    public VideoDTO getVideoPlayer() {
        PromotionalVideoEntity video = videoRepository.findFirstByOrderByVideoId();
        List<ProductDTO> productDTOs = productService.getPromotionalProducts(video);

        VideoDTO videoDTO = new VideoDTO();


        videoDTO.setVideoId(video.getVideoId());
        videoDTO.setVideoUrl(video.getVideoUrl());
        videoDTO.setLink(video.getLink());
        videoDTO.setProducts(productDTOs);

        return videoDTO;
    }

}
