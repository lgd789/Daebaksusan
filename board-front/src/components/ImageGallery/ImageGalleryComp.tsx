import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import CustomPrevArrowComp from './CustomPrevArrowComp';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './ArrowStyles.css'; // ArrowStyles.css 파일 import
import { Product } from 'types';
import { ProductListComp } from 'components/product/ProductListComp';
import { RcmndProductComp } from 'components/product/RcmndProductComp';
import { TimeDealProductComp } from 'components/product/TimeDealProductComp';

interface ImageGalleryProps {
    items: (Product | string)[]; // 상품과 후기 모두를 포함하는 배열
    size?: string;
    fontSize?: string;
    rows?: number;
    component?: React.ComponentType<any>;
}

function CustomArrow(props: any) {
    const { className, style, onClick } = props;
    return (
        <div
            className={`${className}`}
            style={{ ...style, borderRadius: "50%" }}
            onClick={onClick}
        />
    );
}

const ImageGalleryComp: React.FC<ImageGalleryProps> = ({ items, size = "275px", fontSize = "7px", component: Component, rows = 1 }) => {
    const [slidesToShow, setSlidesToShow] = useState(4);
    
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setSlidesToShow(1);
            } else if (window.innerWidth < 1024) {
                setSlidesToShow(2);
            } else if (window.innerWidth < 1280) {
                setSlidesToShow(3);
            } else {
                setSlidesToShow(4);
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        console.log(settings)
        return () => window.removeEventListener('resize', handleResize);
        
    }, []);


    const settings = {
        rows: rows,
        centerSlides: false,
        accessibility: true,
        dots: items.length > slidesToShow,
        infinite: items.length > slidesToShow,
        speed: 1000,
        slidesToShow: Math.max(1, Math.floor(slidesToShow / rows)),
        autoplay: items.length > slidesToShow,
        autoplaySpeed: 2000,
        vertical: false,
        swipe: items.length > slidesToShow,
        swipeToSlide: items.length > slidesToShow,
        arrows: items.length > slidesToShow,
        prevArrow: <CustomArrow />,
        nextArrow: <CustomArrow />,
        // ...(slidesToShow >= 4 && { slidesToScroll: 1 }),
    };

    
    return (
        <Slider {...settings} key={slidesToShow}>
            {items.map((item, index) => (
                <div key={index} className={`p-1 ${Component ? 'h-auto' : 'h-[200px]'}`}>
                    {Component ?(
                        <Component product={item} size={size} fontSize={fontSize} imgSize_w_per={60} imgSize_h_px={'250px'} border="1" shadow={true} />
                    ):(
                        <img src={`${item}`} alt={`Review ${index}`} className="w-full h-full object-cover rounded-md" />
                    )}
                </div>
            ))}
        </Slider>
    );
};

export default ImageGalleryComp;
