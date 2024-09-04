import React, { useEffect, useState } from 'react';
import { Product } from 'types';
import time from 'assets/time.png';
import { ProductListComp } from './ProductListComp';

interface TimeDealProductCompProps {
    product: Product;
    size?: string;
    fontSize?: string;
}

export const TimeDealProductComp: React.FC<TimeDealProductCompProps> = ({ product, size="275px", fontSize="7px" }) => {
    const [remainingTime, setRemainingTime] = useState<string>('');

    useEffect(() => {
        const intervalId = setInterval(() => {
            // 각 제품의 시작일과 종료일을 가져와서 남은 시간을 계산합니다.
            const startDate = new Date(product.startDate);
            const endDate = new Date(product.endDate);
            setRemainingTime(calculateRemainingTime(startDate, endDate));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [product]);

    const calculateRemainingTime = (startDate: Date, endDate: Date): string => {
        const now = new Date();
        const remainingTime = endDate.getTime() - now.getTime();

        if (remainingTime <= 0) {
            return '판매 종료'; // 종료된 경우 메시지를 반환하도록 처리
        }

        const hours = Math.floor(remainingTime / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        return `${hours}시간 ${minutes}분 ${seconds}초`;
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <ProductListComp product={product} size='255px' fontSize='7px' />
            <div className='flex justify-center items-center gap-2'> {/* item-center -> items-center 수정 */}
                <img src={time} alt="Time" className="w-5 h-5 md:w-8 md:h-8" />
                <p className="m-0 text-sm font-bold text-red-600 md:text-lg">{remainingTime}</p>
            </div>
        </div>
    );
};
