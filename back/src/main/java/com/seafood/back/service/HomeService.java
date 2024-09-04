package com.seafood.back.service;

import java.io.IOException;
import java.util.List;

import com.seafood.back.dto.CarouselDTO;
import com.seafood.back.dto.VideoDTO;

public interface HomeService {
    public List<CarouselDTO> getCarouselImageUrls();

    public VideoDTO getVideoPlayer();
}
