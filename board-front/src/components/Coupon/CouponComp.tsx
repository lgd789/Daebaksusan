import React from 'react';
import { Coupon } from 'types';

interface CouponCompProps {
  coupon: Coupon;
}

export const CouponComp: React.FC<CouponCompProps> = ({ coupon }) => {
  
  // 원을 생성하고 배치하는 함수
  // const renderCircles = () => {
  //   const circles = [];
  //   for (let i = 0; i < circleCount; i++) {
  //     const topPosition = i * circleSpacing;
  //     circles.push(
  //       <React.Fragment key={i}>
  //         <div className="absolute left-[-7px] w-[14px] h-[14px] round rounded-full bg-white transform -translate-y-1/2" style={{ top: `${topPosition}px` }}></div>
  //         <div className="absolute right-[-7px] w-[14px] h-[14px] round rounded-full bg-white transform -translate-y-1/2" style={{ top: `${topPosition}px` }}></div>
  //       </React.Fragment>
  //     );
  //   }
  //   return circles;
  // };
  
  const renderCircles = () => {
    const circles = [];
    const circleSize = 14;
    const circleOffset = 7; 
    const circleCount = 9; // 생성할 원의 개수
    const circleSpacing = 22; // 원 사이의 간격
    
    for (let i = 0; i < circleCount; i++) {
      const topPosition = i * circleSpacing;
      circles.push(
        <React.Fragment key={i}>
          <div className={`absolute left-[${circleOffset}px] w-[${circleSize}px] h-[${circleSize}px] round rounded-full bg-white transform -translate-y-1/2`} style={{ top: `${topPosition}px` }}></div>
          <div className={`absolute right-[${circleOffset}px] w-[${circleSize}px] h-[${circleSize}px] round rounded-full bg-white transform -translate-y-1/2`} style={{ top: `${topPosition}px` }}></div>
        </React.Fragment>
      );
    }
    
    return circles;
  };
  return (
    <div className="relative p-6 m-3 rounded-lg shadow-inner bg-gradient-to-l from-blue-400 to-blue-600 h-[180px]">
      {renderCircles()}
      <div className="absolute top-[-20px] right-20 w-2 h-7 rounded-full bg-white"></div>
      <div className="absolute bottom-[-20px] right-20 w-2 h-7 rounded-full bg-white"></div>
      <div className='mx-[35px]'>  
        <div className='text-start'>
          <h2 className="text-xl sm:text-3xl font-bold mb-4 text-white overflow-ellipsis overflow-hidden">{coupon.couponName}</h2>
          <div className="mb-4">
            <div className="flex flex-col">
              <span className="text-lg sm:text-2xl text-white font-bold overflow-ellipsis overflow-hidden">{coupon.discount.toLocaleString()}원 할인</span>
              <p className="text-xs text-white font-semibold overflow-ellipsis overflow-hidden">{new Date(coupon.issueDate).toLocaleDateString()} - {new Date(coupon.validUntil).toLocaleDateString()}</p>
              {coupon.minimumOrderAmount !==0 && (
                <p className="text-xs text-gray-200 overflow-ellipsis overflow-hidden"> 최소주문금액 {coupon.minimumOrderAmount.toLocaleString()}원 </p>
              )}
            </div>
          </div>
          </div>
      </div>
    </div>
  );


};