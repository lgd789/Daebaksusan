import React from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { ReviewStats } from 'types';

interface ReviewAverageCompProps {
    reviewStats: ReviewStats
}

export const ReviewAverageComp: React.FC<ReviewAverageCompProps> = ({ reviewStats }) => {
    const renderStars = (score: number) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            if (i < score) {
                // 꽉 찬 별
                stars.push(<AiFillStar key={i} className="text-yellow-500 text-sm" />);
            } else {
                // 빈 별
                stars.push(<AiOutlineStar key={i} className="text-gray-300 text-sm" />);
            }
        }
        return stars;
    };

    return (
        <div className='w-3/4 m-auto py-12 lg:flex lg:justify-around'>
            <div className="flex flex-col justify-between text-center items-center lg:mr-16">
                <h4 className="font-semibold text-xl">전체 평점</h4>

                <div className="text-6xl font-bold">{reviewStats.avgScore.toFixed(1)}</div>
                <div className="flex justify-center items-center">
                    {renderStars(Math.floor(reviewStats.avgScore))}
                </div>
            </div>

            <div>
                <div className="p-0 m-0">
                    {['fiveStars', 'fourStars', 'threeStars', 'twoStars', 'oneStar'].map((score, index) => (
                        <div key={index} className="flex items-center">
                            <div className='flex'>
                                <div className="hidden sm:block text-sm flex items-center font-semibold">{5 - index}점 </div>
                                <div className="text-sm flex items-center font-semibold">{renderStars(5 - index)}</div>
                            </div>
                            <div className="grow bg-gray-200 h-2 ml-3 rounded-full overflow-hidden w-36 md:w-64">
                                <div className={`bg-blue-700 h-full`} style={{ width: `${(reviewStats[score as keyof ReviewStats] / reviewStats.totalReviews) * 100}%` }}></div>
                            </div>
                            <div className="w-1 ml-2 text-sm text-gray-600">{reviewStats[score as keyof ReviewStats]}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
