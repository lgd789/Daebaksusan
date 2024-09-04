package com.seafood.back.dto;

import com.seafood.back.entity.CarouselEntity;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CarouselDTO {
    private Long carouselId;
    private String imageUrl;
    private String link;

    public static CarouselDTO fromEntity(CarouselEntity carouselEntity) {
        CarouselDTO carouselDto = new CarouselDTO();
        carouselDto.setCarouselId(carouselEntity.getCarouselId());
        carouselDto.setImageUrl(carouselEntity.getImageUrl());
        carouselDto.setLink(carouselEntity.getLink());
        return carouselDto;
    }
}
