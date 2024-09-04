import React, { useEffect, useState } from 'react'
import { ReviewDTO } from 'types/interface/review.interface';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import Slider from 'react-slick';

import CustomPrevArrowComp from 'components/ImageGallery/CustomPrevArrowComp';
import CustomNextArrowComp from 'components/ImageGallery/CustomNextArrowComp';
import ImageGalleryComp from 'components/ImageGallery/ImageGalleryComp';

interface ReviewCompProps {
    review: ReviewDTO;
}



// const settings = {
//     slidesToShow: 3,
//     slidesToScroll: 1, 
//     centerMode: true,
//     centerPadding: '0px',
//     arrows: true,
//     autoplay: true,
//     autoplaySpeed: 2000,
//     dots: true,
//     fade: false,
//     infinite: true,
//     pauseOnFocus: true,
//     pauseOnHover: true,
//     speed: 500,
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 3,
//           slidesToScroll: 3,
//         }
//       },
//       {
//         breakpoint: 600,
//         settings: {
//           slidesToShow: 2,
//           slidesToScroll: 2,
//         }
//       },
//       {
//         breakpoint: 320,
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1
//         }
//       }
//     ]
//   };


const ReviewComp: React.FC<ReviewCompProps> = ({ review }) => {

    const renderStars = (score: number) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            if (i < score) {
                // 꽉 찬 별
                stars.push(<AiFillStar key={i} />);
            } else {
                // 빈 별
                stars.push(<AiOutlineStar key={i} />);
            }
        }
        return stars;
    };


    return (
        <div className="p-10 border-t-2 border-blue-700">
            <div className='flex'>
                <div className="text-6xl">ㅇ</div>
                <div>
                    <div className="grid grid-cols-2">
                        {review.isBest && (
                            <div className="bg-gray-100 text-xs p-1 text-blue-600 font-bold">
                                베스트리뷰
                            </div>
                        )}
                        <div></div>
                    </div>
                    <div className="m-1 text-black text-start text-sm">{review.name}</div>
                    <div className="text-xs text-gray-400">리뷰 77 · 사진 487 · 장소 68</div>
                </div>
            </div>
            <div className="flex m-2">
                <div className="flex text-yellow-500 mr-3 content-center text-sm">{renderStars(review.score)}</div>
                <div className="content-center text-sm text-gray-400">{review.reviewDate}</div>
            </div>
            {review.imageUrls.length > 0 && (
                <div className="w-[200px] sm:w-[350px] md:w-[500px] lg:w-[700px] xl:w-[1000px] h-[230px]">
                    {review.imageUrls.length > 0 && (
                        <ImageGalleryComp items={review.imageUrls} />
                    )}
                </div>
            )}


            <div className="m-2 text-start text-xs text-gray-500">{review.productName + review.optionName}</div>
            <div className="mt-4 m-2 text-start text-sm text-gray-600">{review.contents}</div>

            {review.responses.map((response, index) => (
                <div className="bg-gray-100 mt-4 p-2 text-sm rounded-md">
                    <div key={index}>
                        {/* <div className="p-2 text-start text-black font-bold">{response.name}</div> */}
                        <div className="p-2 text-start text-black font-bold">대박수산</div>
                        <div className="p-2 text-start text-gray-600">{response.responseText}</div>
                    </div>
                </div>
            ))}

        </div>

    )
}
export default ReviewComp;
